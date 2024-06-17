import TPL from "./tpl";
import Render from "./render";
import Network from '../network/router';

const map={};

const self = {
    single:(name,ck)=>{
        if(map[name]) return ck && ck(map[name]);
        const list=[name];
        self.auto(list,(res)=>{
            if(res) return ck &&  ck(res[0]);
            return ck && ck(false);
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
    auto:(list,ck,final)=>{
        if(!final) final=[];
        if(list.length===0) return ck && ck(final);
        const single=list.pop();
        const key=single.name;
        if(map[key]!==undefined){
            final.push(map[key]);
            return self.auto(list,ck,final);
        }

        Network("anchor").view({ name: key }, "anchor", (data) => {
            if (!data || !data.name) return self.auto(list,ck,final);
            Network("anchor").view(data.block, "hash", (hash) => {
                data.price = single.price;
                data.free = single.free;
                data.target = single.target;
                data.hash=hash;

                map[key]=data;

                TPL.view(data.raw.tpl,(dt)=>{
                    const basic = {
                        cell: dt.cell,
                        grid: dt.grid,
                        target: dt.size
                    }
                    Render.thumb(hash,dt.image,dt.parts, basic,data.raw.offset,(bs64)=>{
                        map[key].bs64=bs64;

                        final.push(map[key]);
                        return self.auto(list,ck,final);
                    });
                });
            });
        });
    },
}   

export default self;