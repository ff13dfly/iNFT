const { config } = require('./config_anchor.js');
const tools = require('./lib/tools.js');
const { output } = require('./lib/output.js');
const AnchorJS = require('./network/anchor.full.js');
const { REDIS } = require('./lib/redis.js');
const saving=require('./system/cache_anchor');

//13598
//Redis data sample: Entry data
const DEBUG=true;
const debug_config={
    start:4000,
    clean:false,            //force to clean all redis cache
}

const entry = {
    block_stamp: 0,         //which block start to read iNFT
    block_subcribe:0,       //current subcribe start block
    done_left:0,            //left blocknumber cached
    done_right:0,           //right blocknumber cached
    step: 20,               //block step to read iNFT
};

//global tags
let catchup = false;          //when cache get the block_subcribe, set this tag to true

//functions
let linking = false;
let wsAPI = null;
const self = {
    init: (ck) => {
        const uri = config.node;
        if (linking) return setTimeout(() => {
            self.init(ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const { ApiPromise, WsProvider } = require('@polkadot/api');
        try {
            const provider = new WsProvider(uri);
            ApiPromise.create({ provider: provider }).then((api) => {
                wsAPI = api;
                linking = false;
                return ck && ck(wsAPI);
            });
        } catch (error) {
            console.log(error);
            linking = false;
            return ck && ck(error);
        }
    },
    load: (ck) => {
        const key = config.keys.status;
        return REDIS.exsistKey(key, (is, err) => {
            if(!is) {
                REDIS.setKey(key, JSON.stringify(entry), (res,err) => {
                    if(err!==undefined) return ck && ck(false);
                    return ck && ck(tools.copy(entry));
                })
            } else {
                REDIS.getKey(key, (res,err) => {
                    if(err!==undefined) return ck && ck(false);
                    try {
                        const data=JSON.parse(res);
                        return ck && ck(data);
                    } catch (error) {
                        return ck && ck(false);
                    }
                });
            }
        });
    },
    remove:(key,ck)=>{
        console.log(key);
        REDIS.keys(key,(arr)=>{
            console.log(arr);
            REDIS.multiRemove(arr,()=>{
                return  ck && ck();
            });
        });
    },
    reset:(ck,arr)=>{
        //1. remove all prefix;
        if(arr===undefined){
            const prefix=config.keys.prefix;
            const ps=[];
            for(var k in prefix){
                ps.push(prefix[k]);
            }
            return self.reset(ck,ps);
        }

        if(arr.length===0){
            return REDIS.remove(config.keys.status,()=>{
                output(`Clearn the redis cache successful.`,'error',true);
                output(`Please close DEBUG mod or set debug_config.clean to false, then restart this robot.`,'error',true);
                return ck && ck();
            });
        } 
        const key=arr.pop();
        self.remove(key,()=>{
            return self.reset(ck,arr);
        });
    },
    read:(bks,ck,map)=>{
        if(map===undefined) map={};
        if(bks.length===0) return ck && ck(map);
        const block=bks.pop();
        AnchorJS.hash(block,(hash)=>{
            AnchorJS.full(hash,block,(list)=>{
                if(!list || list.error) return self.read(bks,ck,map);
                if(list.set!==null || list.buy!==null || list.sell!==null || list.revoke!==null){
                    map[block]=list;
                }
                return self.read(bks,ck,map);
            });
        });
    },
    toLeft:(status,ck)=>{
        output(`Start to cache up history iNFTs, left limit ${status.done_left}`,'primary',true);
        //return ck && ck();
        if(status.done_left<1) return ck && ck();    
        const arr=[];
        for(let i=0;i<status.step;i++){
            const p=status.done_left-i;
            if(p===0) break;
            arr.push(p);
        }
        const len=arr.length;
        output(`Last left block to cache:${arr[0]}`);
        self.read(arr,(map)=>{
            const left=true;
            if(!tools.empty(map)){
                saving(map,left,()=>{
                    output(`Cached data saved to Redis`,'success',true);
                    status.done_left=status.done_left-len;
                    REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                        if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                        return self.toLeft(status,ck);
                    });
                });
            }else{
                status.done_left=status.done_left-len;
                REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                    if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                    return self.toLeft(status,ck);
                });
            }
        });
    },
    toRight:(status,ck)=>{
        if(status.done_right >= status.block_subcribe){
            output(`Catch up to the latest subcribe block, status: ${JSON.stringify(status)}`,'success',true);
            return ck && ck();
        } 
        output(`Start to catch up the subcribe block. From ${status.done_right} to ${status.block_subcribe}`,'primary',true);
        const arr=[];
        for(let i=0;i<status.step;i++){
            const p=status.done_right+i;
            if(p>=status.block_subcribe) break;
            arr.push(p);
        }
        const len=arr.length;
        output(`Last block to cache:${arr[len-1]}`);
        self.read(arr,(map)=>{
            const left=false;
            if(!tools.empty(map)){
                saving(map,left,()=>{
                    //output(`Cached data saved to Redis`,'success',true);
                    status.done_right=status.done_right+len;
                    REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                        if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                        return self.toRight(status,ck);
                    });
                });
            }else{
                status.done_right=status.done_right+len;
                REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                    if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                    return self.toRight(status,ck);
                });
            }
        });
    },
    autoCache:(status)=>{
        output(`Caching the history started, status:${JSON.stringify(status)}`,'primary',true);
        //0.check the done_right data
        if(status.done_right>=status.block_subcribe) return self.toLeft(status);

        return self.toRight(status,()=>{
            catchup=true;
            output(`Catch up the subcribe.`,'primary',true);
            self.toLeft(status,()=>{
                output(`Great! All iNFTs are cached.`,'success',true);
            });
        });
    },
};

output(`\n____________iNFT____________Robot____________Anchor____________Network____________iNFT____________`, "success", true);
output(`Start iNFT history cache robot ( version ${config.version} ), author: Fuu, 2024.06`, "", true);
output(`Will storage iNFT data to local Redis, then the Market API can use these data.`, "", true);

//0. handle unknown error
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
    output(`UnhandledRejection`, 'error');
});

process.on('uncaughtException', (error) => {
    console.log(error);
    output(`uncaughtException`, 'error');
});

//when restart the system, need to run this function
if(DEBUG && debug_config.clean) return self.reset();

//1.load the cache status from Redis
let first = true;         //first subcribe tag
let map=null;             //subcribe cache, before catchup, cache iNFTs here.
let gap=null;             //when saving cached iNFTs, new subcribe iNFTs here.
self.load((status) => {
    if(status===false) return output(`Failed to load status from Redis. Please check the system`,'error',true);
    output(`Load status successful, ready to link to Anchor Network for the next step.`,'primary',true);
    self.init((wsAPI) => {
        output(`\nLinked to node: ${config.node}`, "success", true);
        output(`____________iNFT____________Robot____________Anchor____________Network____________iNFT____________`, "success", true);

        AnchorJS.set(wsAPI);
        AnchorJS.subcribe((list, block, hash) => {
            //2.1. if first time to run the robot, start to launch the history process
            if (first) {
                first = false;
                //a.init the status of caching.
                if(status.block_stamp===0){
                    output(`History robot start the first time, stamp it at ${block}`,"primary",true);
                    status.block_stamp=block;

                    if(DEBUG){
                        status.done_right=debug_config.start;
                        status.done_left=debug_config.start;
                    }else{
                        status.done_right=block;
                        status.done_left=block;
                    }

                    status.block_subcribe=block;
                    REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                        if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                        self.autoCache(status); //b. start to run the autocache
                    })
                }else{
                    output(`History robot recover, status: ${JSON.stringify(status)}`,"primary",true);
                    status.block_subcribe=block;
                    REDIS.setKey(config.keys.status, JSON.stringify(status), (res,err) => {
                        if(err!==undefined) return output(`Failed to save data on Redis. Please check the system`,'error',true);
                        
                        self.autoCache(status); //b. start to run the autocache
                    });
                }
            }

            output(`[${block.toLocaleString()}] ${hash} , ${list.length} iNFTs.`);

            //2.2. record the recent data.
            if(catchup){
                //output(`Storage the iNFTs per block.`);

            }else{
                //output(`Cache the iNFTs records, when catchup, start to storage.`);
            }
        });
    });
});