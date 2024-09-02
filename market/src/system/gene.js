import INDEXED from "../lib/indexed";
import Config from "./config";

import tools from "../lib/tools";

const config = {
    indexDB: "inftDB",
    table: "gene",
    keypath: "name",
    map: {
        name: { unique: true },
        update: { unique: false },
        create: {unique:false},
        content: { unique: false },
        image:{unique:false}
    },
}

const map = {};
const funs={
    format:()=>{

    },
}

const self={
    list:()=>{

    },
    get:(name,ck)=>{

    },
    update:{
        size:(name,width,height,ck)=>{

        },
        cell:(name,width,height,ck)=>{

        },
        grid:(name,x,y,ck)=>{

        },
        series:(name,arr,ck)=>{

        },
        image:(name,json,ck)=>{

        },
    },
}
export default self;