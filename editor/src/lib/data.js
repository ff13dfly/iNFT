const map={
    template:null,      //模版image文件
    size:{              //模版对应的数据
        cell:[50,50],   //组件的基础尺寸
        grid:[8,20],    //图像的尺寸
    },
    basic:null,         //模版的网格划分
    NFT:null,           //NFT的JSON文件
    hash:null,          //用于显示NFT的Hash
    selected:null,      //选中的NFT的片段
    subcribe:{},        //挂载的sub的funs
}

const self={
    set:(key,value)=>{
        //console.log(key);
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