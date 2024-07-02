import Encry from "./encry";

//using account address (password optional) to encry the setting to localstorage

let address="";
const config={
    system:{        //this part will be written to localstorage
        name:"iNFT Market",         //dApp name needed for wallet
        password:false,             //enable local setting password,
        key:"imarket_config",       //localstorage key name to confirm the setting
        prefix:"iMarket",
    },
    storage:{           
        DBname:"inftDB",
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
        }
    },
    network:{

    },
}

const funs={
    exsist:()=>{
        const data=localStorage.getItem(config.system.key);
        return data!==null;
    },
    login:()=>{

    },
}

const self={
    account:(addr)=>{
        address=addr;
        return true;
    },
    init:(force)=>{
        if((!funs.exsist() || force) && address!==""){
            console.log(`Here to saving the setting data`);
            const key=Encry.md5(address);
            Encry.auto(key);
            const val=Encry.encrypt(JSON.stringify(config.system));
            localStorage.setItem(`${config.system.prefix}_${key}`,val);
        }
    },
    get:(ck,key)=>{
        
    },
    set:(path,val,ck)=>{

    },
    password:(pass,ck)=>{

    },
}

export default self;