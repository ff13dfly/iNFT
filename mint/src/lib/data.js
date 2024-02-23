const map={
    template:null,      //模版image文件
}

const self={
    set:(key,value)=>{
        //console.log(key,value);
        if(map[key]===undefined) return false;
        map[key]=value;
        
        return true;
    },
    get:(key)=>{
        //console.log(map);
        if(map[key]===undefined) return false;
        return map[key];
    },
    reset:()=>{
        map.template=null;
        map.NFT=null;
        map.hash="";
        map.selected=null;
    },
};

export default self;