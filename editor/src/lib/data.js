let map={
    template:null,      //template image file, Base64 codec
    size:{              //template basic parameters
        cell:[50,50],      //image grid size as cell
        grid:[8,1],        //image line and row amounts
        target:[360,360]   //NFT target size
    },
    NFT:null,           //iNFT definition JSON file without image
    hash:null,          //mock hash to render iNFT
    selected:null,      //selected iNFT parts index
    grid:null,          //selected index of iNFT part's image array
    subcribe:{},        //subcribes funs added here to check iNFT template
}

const backup=JSON.stringify(map);

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
        map=JSON.parse(backup);
    },
};

export default self;