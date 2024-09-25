const { REDIS } = require("../lib/redis.js");

const { config } = require("../config_anchor.js");
const { output } = require("../lib/output.js");

const self={
    getINFT:(obj,block)=>{
        const raw=obj.args.raw;
        const NFT={
            tpl:raw.tpl,
            from:raw.from,              //template source type
            orgin:raw.orgin,            //storage website
            offset:raw.offset,          //mint offset
            signer:obj.signer,          //the signer of this iNFT
            block:block,                //on which block
            result:obj.hash,            //result hash
            index:obj.index,            //index of the iNFT data on block
            stamp:obj.stamp,            //block create timestamp
        };
        if(obj.target) NFT.target=obj.target;   //optional, target block
        return NFT;
    },
    getArrayFromMap:(map,left)=>{
        const arr=[];
        for(let block in map){
            const row=map[block];
            row.block=block;
            !left?arr.push(row):arr.unshift(row);
        }
        return arr;
    },
}

/*  Saving the anchor data to Redis
*   @param  {object}		map	        //{set:[],sell:[],buy:[],revoke:[],divert:[],drop:[]}
*   @param  {boolean}       [left]      //direction to push data
*   @param  {function}      ck          //callback function
*/
module.exports =(map,left,ck)=>{
    output(`Got iNFT related anchors, ready to cache. Write on ${!left?"RIGHT":"LEFT"} side: `,"dark",true);
    const keys=config.keys;
    const prefix=keys.prefix;
    let done=false;                 //wether callback

    //!important, the map is order by block number, 
    //!important, when push to the queue from the left side, need to change the order

    const arr=self.getArrayFromMap(map,left);

    //output(`Total ${arr.lenght} blocks need to cache.`,"success",true);

    let working=0;     //working tag, when it is 0, callback

    for(let k=0;k<arr.length;k++){
        const data=arr[k];
        const block=data.block;
        output(`Working on block [${block}] anchor related list.`,"success",true);
        if(data.set===null && data.sell===null && data.buy===null && data.revoke===null ){
            continue;
        }

        if(data.set!==null){
            for(let i=0;i<data.set.length;i++){
                const row=data.set[i];
                const name=row.args.key;
                
                //1.1. save raw iNFT data;
                working++;
                const NFT=self.getINFT(row,parseInt(block));
                const key=`${prefix.raw}${name}_${block}`;
                REDIS.setKey(key,JSON.stringify(NFT),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                });

                //1.2. push to template queue;
                working++;
                const qu_template=`${prefix.template}${NFT.tpl}`;
                REDIS.pushQueue(qu_template,key,(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.3. push to history queue;
                working++;
                const qu_history=`${prefix.history}${name}`;
                const history=[block,row.index,row.stamp,"set",row.signer];
                REDIS.pushQueue(qu_history,JSON.stringify(history),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.4. push to account queue;
                working++;
                const qu_account=`${prefix.account}${row.signer}`;
                REDIS.pushQueue(qu_account,key,(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.5. push to block queue;
                working++;
                const qu_block=`${prefix.block}${block}`;
                const block_data=[row.index,name,"set",row.signer];
                REDIS.pushQueue(qu_block,JSON.stringify(block_data),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);
            }

            //1.6. push to iNFT list
        }

        if(data.sell!==null){
            //console.log("sell:"+JSON.stringify(data.sell));
            for(let i=0;i<data.sell.length;i++){
                //working++;
                const row=data.sell[i];
                const name=row.args.key;
                //console.log(`sell[${i}]:`+JSON.stringify(row));

                //1.1. push to selling queue;  
                
                //1.2. push to history queue;
                working++;
                const qu_history=`${prefix.history}${name}`;
                //console.log(qu_history);
                const history=[block,row.index,row.stamp,"sell",row.signer,row.args.target.Id,row.args.price];
                REDIS.pushQueue(qu_history,JSON.stringify(history),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.3. push to block queue;
            }
        }

        if(data.buy!==null){
            for(let i=0;i<data.buy.length;i++){
                //working++;
                const row=data.buy[i];
                const name=row.args.key;
                console.log(`buy[${i}]:`+JSON.stringify(row));
                //1.1. remove from selling queue;

                //1.2. push to done queue;
                
                //1.2. push to history queue;
                working++;
                const qu_history=`${prefix.history}${name}`;
                const history=[block,row.index,row.stamp,"buy",row.signer];
                REDIS.pushQueue(qu_history,JSON.stringify(history),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.3. push to block queue;
            }
        }

        if(data.revoke!==null){
            //console.log("revoke:"+JSON.stringify(data.revoke));
            for(let i=0;i<data.revoke.length;i++){
                //working++;
                const row=data.revoke[i];
                const name=row.args.key;
                //1.1. remove from selling queue;
                
                //1.2. push to history queue;
                working++;
                const qu_history=`${prefix.history}${name}`;
                const history=[block,row.index,row.stamp,"revoke",row.signer];
                REDIS.pushQueue(qu_history,JSON.stringify(history),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,"error");
                    if(working<1){
                        done=true;
                        return ck && ck();
                    } 
                },left);

                //1.3. push to block queue;
            }
        }

        if(data.divert!==null){
            for(let i=0;i<data.divert.length;i++){
                const row=data.divert[i];
                const name=row.args.key;

                //1.1. push to history queue;
            }
        }

        if(data.drop!==null){
            for(let i=0;i<data.drop.length;i++){
                const row=data.drop[i];
                const name=row.args.key;

                //1.1. push to history queue;
            }
        }
    }

    //output(`Order: ${JSON.stringify(test)}`,"error",true);
    //add interval to callback
    const ttt=setInterval(() => {
        if(working<1 && !done){
            clearInterval(ttt);
            return ck && ck();
        }else{
            clearInterval(ttt);
        }
    },100);
};