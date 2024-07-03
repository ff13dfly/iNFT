import { FaEthereum } from "react-icons/fa";
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
            nodes:[],
        },
        polkadot:{
            coin:"DOT",
            mining:false,
            template:false,
            nodes:[],
        },
        solana:{
            coin:"SOL",
            mining:true,
            template:true,
            nodes:[],
        },
        aptos:{
            coin:"APTOS",
            mining:true,
            template:true,
            nodes:[     //check network type by node URL 

            ],
        },
        sui:{
            coin:"SUI",
            mining:true,
            template:true,
            nodes:[],
        },
        bitcoin:{
            coin:"BTC",
            mining:false,
            template:false,
            nodes:[],
        },
        ethereum:{
            coin:"ETH",
            mining:false,
            template:false,
            nodes:[],
        },
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

    /* fresh the setting
    * @param [force]    boolean     //force to fresh setting
    * @param [pass]     string      //password to fresh setting
    */
    fresh:(force,pass)=>{
        if((!funs.exsist() || force) && address!==""){
            if(pass!==undefined){
            
            }else{
                //1.system config
                const key=Encry.md5(address);
                Encry.auto(key);
                const val=Encry.encrypt(JSON.stringify(config.system));
                localStorage.setItem(`${config.system.prefix}_${key}`,val);

                //2.network config
            }
        }
    },
    get:(ck,key)=>{
        if(key===undefined){

        }else{

        }
    },
    set:(path,val,ck)=>{

    },

    //use password to fresh localstorage
    password:(pass,ck)=>{
        const real_pass=Encry.md5(pass);
        self.init(true,real_pass);
    },
}

export default self;