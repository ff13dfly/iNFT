import TPL from "./tpl";
import Render from "./render";
import Network from '../network/router';

const map={};

const self = {
    single:(name,ck,normal)=>{
        if(map[name]) return ck && ck(map[name]);
        if(!normal){
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
        }else{
            Network("anchor").view(name, "owner", (data) => {
                //console.log(data);
                const row={
                    name:name,
                    owner:data.address,
                    price:0,
                    target:data.address,
                    free:false,
                }
                self.auto([row],(res)=>{
                    if(res) return ck &&  ck(res[0]);
                    return ck && ck(false);
                });
            });
        }
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
    search:(val,type,ck)=>{
        const result=[];
        switch (type) {
            case 'template':
                for(var k in map){
                    const row=map[k];
                    const tpl=row.raw.tpl;
                    if(Array.isArray(val)){
                        if(val.includes(tpl)) result.push(row);
                    }else{
                        if(val===tpl) result.push(row);
                    }
                }
                break;
            case 'price':
                
                break;
            default:
                break;
        }
        return ck && ck(result);
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

        const net="anchor";
        Network(net).view({ name: key }, "anchor", (data) => {
            if (!data || !data.name) return self.auto(list,ck,final);
            Network(net).view(data.block, "hash", (hash) => {
                data.price = single.price;
                data.free = single.free;
                data.target = single.target;
                if(!data.Network) data.network=net;         //add default network settling
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