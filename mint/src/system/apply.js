import tools from "../lib/tools";

const funs={
    format:{
        name:()=>{
            return `apply_${tools.char(10)}`;
        },
        raw:()=>{

        },
        protocol:(alink)=>{

        },
    }
}

const self={
    submit:(pair,inft,bounty_alink,index,ck)=>{
        console.log(pair,inft,bounty_alink,index);
    },
}

export default self;