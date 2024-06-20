import TPL from "./tpl";
import Render from "./render";
import Network from '../network/router';

const map={};

let locker=false;
const self = {
    single:(name,ck)=>{
        if(map[name]) return ck && ck(map[name]);
        Network("anchor").view(name, "selling", (data) => {
            console.log(data);
            if(data===false) return ck && ck(false);

            const row={
                name:name,
                owner:data[0],
                price:parseInt(data[1]),
                target:data[2],
                free:data[0]===data[2],
            }
            self.auto([row],(res)=>{
                if(res) return ck &&  ck(res[0]);
                return ck && ck(false);
            });
        });
    },
    overview:(ck)=>{
        const tpls=[];
        let min=0,max=0;
        let first=true;
        for(var k in map){
            const row=map[k];
            if(row.price>max) max=row.price;
            if(row.price<min || first) min=row.price;
            if(!tpls.includes(row.raw.tpl)) tpls.push(row.raw.tpl);
            first=false;
        }
        return ck && ck({
            template:tpls,
            range:[min,max],
        }) 
    },
    nav:(step)=>{
        const sum=Object.keys(map).length;
        return {
            page:Math.ceil(sum/step),
            step:step,
            sum:sum,
        }
    },
    filter:(value,type)=>{

        switch (type) {
            case "template":
                const arr=[];
                for(var k in map){
                    const row=map[k];
                    //console.log(k);
                }
                break;
        
            default:
                break;
        }
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