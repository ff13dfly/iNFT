import tools from "../lib/tools";
import Encry from "../lib/encry";

//using account address (password optional) to encry the setting to localstorage
let metadata={
    address:"",
    pass:"",
}
let cache=null;         //setting cache, if no setting, keep null

const config={
    system:{        //this part will be written to localstorage
        name:"iNFT Market",         //dApp name needed for wallet
        password:false,             //enable local setting password,
        prefix:"imxt",              //prefix of localstorage
        key:"local_setting",        //default local setting key
        avatar:{
            base:"https://robohash.org",
            set:"?set=set2",
        },
    },
    account:{
        password:"",                //password to encry the private key
    },
    storage:{           
        DBname:"inftDB",
        password:"",                //password for image cache
        tables:{
            template:{
                keypath: "cid",
                map: {
                    cid: { unique: true },
                    stamp: { unique: false },
                    thumb: { unique: false },
                    image: { unique: false },
                    content: { unique: false },
                },
                step:10,
            },
            inft:{
                keypath:"name",
                map:{
                    name: { unique: true },
                    stamp: { unique: false },
                    thumb: { unique: false },
                },
            },
            account:{
                keypath:"address",
                map:{
                    address: { unique: true },
                    stamp: { unique: false },
                    metadata: { unique: false },
                }, 
            },
        },
    },
    froxy:{
        market:[
            "http://localhost/iNFT/service/api/",
        ],
        ipfs:[
            "https://ipfs.w3os.net",
        ],
        bitcoin:[

        ],
        ethereum:[

        ],
        price:[

        ],
    },
    network:{
        anchor:{
            coin:"",
            mining:true,
            template:true,
            nodes:[
                "wss://dev2.metanchor.net",
            ],
            test:{},
        },
        tanssi:{
            coin:"",
            mining:true,
            template:false,
            nodes:[
                "wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network"
            ],
        },
        polkadot:{
            coin:"DOT",
            mining:false,
            template:false,
            nodes:[
                "",
            ],
        },
        solana:{
            coin:"SOL",
            mining:true,
            template:true,
            nodes:[
                "",
            ],
        },
        aptos:{
            coin:"APTOS",
            mining:true,
            template:true,
            nodes:[     //check network type by node URL 
                "",
            ],
        },
        sui:{
            coin:"SUI",
            mining:true,
            template:true,
            nodes:[
                "",
            ],
        },
        bitcoin:{
            coin:"BTC",
            mining:false,
            template:false,
            nodes:[
                "",
            ],
        },
        ethereum:{
            coin:"ETH",
            mining:false,
            template:false,
            nodes:[
                "",
            ],
        },
    },
}

const funs={
    /*  Set the account to check setting 
    * @param  {string}  addr     //account to get setting
    */
     set:(addr,pass)=>{
        if(addr) metadata.address=addr;
        if(pass) metadata.pass=pass;
        return true;
    },

    //get the setting key by 
    getSettingKey:(addr,pass)=>{
        if(!addr && !pass) return `${config.system.prefix}_${config.system.key}`;
        if(addr && !pass) return `${config.system.prefix}_${Encry.sha256(addr)}`;
        if(addr && pass) return config.system.prefix+'_'+Encry.sha256(`${addr}${pass}`);
        return `${config.system.prefix}_${config.system.key}`;
    },
    decodeData:(raw,addr,pass)=>{
        const offset=Encry.md5(!pass?addr:(addr+pass));
        Encry.auto(offset);
        return Encry.decrypt(raw);
    },
    encodeData:(raw,addr,pass)=>{
        const offset=Encry.md5(!pass?addr:(addr+pass));
        Encry.auto(offset);
        return Encry.encrypt(raw);
    },
}

//test demo
const test={
    test_init:()=>{
        const addr="5D5K7bHqrjqEMd9sgNeb28w9TsR8hFTTHYs6KTGSAZBhcePg";
        const pass=Encry.md5("555666"+addr);
        self.init((data)=>{
            self.set(["system","name"],"my test system",true);
            console.log(self.get());
        },addr,pass);
    },
}

const self={
    /* check wether setting encried localstorage
    * 
    */
    exsist:(addr,pass)=>{

    },

    /*get the setting
    * @param    {function}  ck      //callback
    * @param    {string}    [addr]  //address to get setting
    * @param    {string}    [pass]  //password to get setting
    * return
    *   {object}  setting object
    */
    init:(ck,addr,pass)=>{
        funs.set(addr,pass);
        const status={
            first:true,
            msg:"null",
        }
        //1.check wether setting data
        const key=funs.getSettingKey(addr,pass);
        const data=localStorage.getItem(key);
        if(data===null){
            cache=tools.clone(config);      //set default setting
            return ck && ck(status);
        }

        //2.decode encry setting;
        const str=funs.decodeData(data,addr,pass);
        if(!str){
            status.first=false;
            status.message="Invalid password or manage account.";
            cache=tools.clone(config);      //set default setting
            return ck && ck(status);
        }
        try {
            const cfg=JSON.parse(str);
            cfg.stamp=tools.stamp();        //leave a stamp to 
            cache=tools.clone(cfg);         //set customer setting
            return ck && ck(status);

        } catch (error) {
            status.first=false;
            status.message="Invalid config setting file";
            return ck && ck(status);
        } 
    },    

    /* fresh the setting
    * @param {boolean}    [force]    //force to fresh setting
    * @param {string}     [pass]     //password to fresh setting
    */
    save:()=>{
        const key=funs.getSettingKey(metadata.address,metadata.pass);
        //console.log(key);
        const dt=JSON.stringify(cache);
        if(key.length===(64+config.system.prefix.length+1)){    //check wether encried;
            const edata=funs.encodeData(dt,metadata.address,metadata.pass);
            //console.log(edata);
            localStorage.setItem(key,edata);
        }else{
            localStorage.setItem(key,dt);
        }
    },
    get:(path,obj)=>{
        //1.check wether init the setting
        if(cache===null) return self.init(()=>{
            return self.get(path);
        });
        if(obj===undefined) obj=cache;
        if(!path) return tools.clone(obj);
        //console.log(`here:${JSON.stringify(path)}`);
        
        //2.saving result if the end of path
        if(Array.isArray(path)){
            if(path.length===1){
                //console.log(`here: ${!obj[path[0]]?false:tools.clone(obj[path[0]])}`)
                return !obj[path[0]]?false:tools.clone(obj[path[0]]);
            }else{
                const kk=path.shift();
                obj=obj[kk];
                return self.get(path,obj);
            }
        }else{
            return !obj[path]?false:tools.clone(obj[path]);
        }
    },
    set:(path,val,force,obj)=>{
        //1.check wether init the setting
        if(cache===null) return self.init(()=>{
            return self.set(path,val,force);
        });

        //2.saving result if the end of path
        if(obj===undefined) obj=cache;
        if(path.length===1){
            if(!obj[path[0]]) return false;
            obj[path[0]]=val;
            if(force) self.save();
            return true;
        }

        //3.reset the point to the setting path
        const kk=path.shift();
        if(!obj[kk]) return false;
        obj=obj[kk];
        return self.set(path,val,force,obj);
    },
}

export default self;