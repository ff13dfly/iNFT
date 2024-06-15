import TPL from "./tpl";
import Render from "./render";

const map={};

const funs={
    thumb:()=>{

    },
}

const self = {
    cache:(list,ck)=>{
        if(list.length===0) return ck && ck();
        const single=list.pop();
        TPL.view(single.raw.tpl,(dt)=>{
            const basic = {
                cell: dt.cell,
                grid: dt.grid,
                target: dt.size
            }
            Render.thumb(single.hash,dt.image,dt.parts, basic,single.raw.offset,(bs64)=>{
                single.bs64=bs64;
                map[single.name]=single;
                return self.cache(list,ck);
            });
        });
    },
    
    view:(list)=>{
        const arr=[];
        for(let i=0;i<list.length;i++){
            const key=list[i];
            if(map[key]) arr.push(map[key]);
        }
        return arr;
    },
}   

export default self;