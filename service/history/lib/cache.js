/*
* 缓存操作部分
* 1.使用File进行大Anchor进行缓存；
* 2.使用Redis进行Anchor的队列缓存；
*/

const { config } = require("../config");

/***********************************/
/*********文件缓存功能实现*************/
/***********************************/

const fs=require("fs");
const md5 =require("md5");
const cfgCache=config.cache;

const file={
    init:(obj)=>{
        if(!obj) return false;
        for(let k in cfgCache){
            if(obj[k]!=undefined) cfgCache[k]=obj[k];
        }
        return true;
    },
    save:(name,data,ck)=>{
        //console.log(data);
        console.log(`[ file.save ] Saving ${name}`);
        var str=md5(name);
        var path=file.getPath(str,cfgCache.folder,cfgCache.level);
        if(!fs.existsSync(path)) fs.mkdirSync(path,{recursive:true});

        fs.writeFile(path+str+cfgCache.suffix, data,"utf8",function (err) {
            if (err) return ck && ck({error:err});
            return ck && ck(str);
        });
        
    },
    img:(data,index,suffix,ck)=>{
        var hash=file.hash();
        var cfg=config.image,skip=true;
        var path=file.getPath(md5(`${hash}-${index}`),cfg.folder,cfg.level,skip);
        console.log(`File [${index}] hash [ ${hash} ]: ${path}`);

        var folder=`${cfg.folder}/${path}`;
        if(!fs.existsSync(folder)) fs.mkdirSync(folder,{recursive:true});

        var target=`${path}${hash}.${!suffix?"jpg":suffix}`;
        //console.log(`Ready to write to file : ${folder}`);
        fs.writeFile(`${cfg.folder}/${target}`, atob(data),"ascii",function (err) {
            if (err){
                //console.log(err);
                return ck && ck(index,{error:err});
            } 
            return ck && ck(index,target);
        });
    },
    hash:function(n){
        return Math.random().toString(36).substr(n!=undefined?n:5);
    },
    read:(name,ck)=>{
        var str=md5(name);
        var path=file.getPath(str,cfgCache.folder,cfgCache.level);
        var target=path+str+cfgCache.suffix;
        fs.stat(target,(err,stats)=>{
            if (err) return ck && ck({error:err});
            if(!stats.isFile()) return ck && ck(false);
            fs.readFile(target,(err,data)=>{
                if (err) return ck && ck({error:err});
                return ck && ck(data.toString());
            });
        });
    },
    remove:(path,sub)=>{
        var files = [];
        if( fs.existsSync(path) ) {
            files = fs.readdirSync(path);
            files.forEach(function(fa,index){
                var curPath = path + "/" + fa;
                if(fs.statSync(curPath).isDirectory()) {
                    file.remove(curPath,true);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            if(sub) fs.rmdirSync(path);
        }
    },
    getPath:(str,folder,level,skip)=>{
        let path=skip?"":(folder+"/");
        for(var i=0;i<level;i++) path+=str.substr(i+i,2) +"/";
        return path;
    },
};

/***********************************/
/*********Redis缓存功能实现***********/
/***********************************/

const redis = require("redis");
const client = redis.createClient();
client.connect();

const prefix=config.prefix;
let debug=null;         //debug的信息部分;
const self={
    setDebug:function(dbg){
        debug=dbg;
    },
    cleanDebug:function(){
        debug=null;
    },

    getStamp:function(ck){
        var key=prefix.stamp;
        client.get(key).then(ck);
    },
    setStamp:function(ck){
        var key=prefix.stamp;
        var n= Date.parse(new Date());
        client.set(key,n).then(() => {
            return ck && ck();
        });
    },
    getKeys:function(ck){
        var main=prefix.index;
        client.hKeys(main).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    delIndex:function(ck){
        var main=prefix.index;
        client.del(main,ck);
    },
    incHash:function(anchor,ck){
        var main=prefix.index;
        client.hIncrBy(main,anchor,1).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(true);
        });
    },
    getIndex:function(anchor,ck){
        const qu=prefix.queue+anchor;
        client.lRange(qu,0,0).then((n,err) => {
            if(err) return ck && ck(err);
            return ck && ck(n.length===0?0:parseInt(n[0]));
        });
    },
    lenQueue:function(anchor,ck){
        const qu=prefix.queue+anchor;
        client.lLen(qu).then((n,err) => {
            if(err) return ck && ck(err);
            return ck && ck(parseInt(n));
        });
    },
    pushQueue:function(anchor,block,ck){
        const qu=prefix.queue+anchor;
        client.lPush(qu,""+block).then((data,err) => {
            if(err) return ck && ck(err);
            return ck && ck(true);
        });
    },
    rangeQueue:function(anchor,start,step,ck){
        console.log(`${anchor} from ${start} to ${start+step-1}, step : ${step}`);
        const qu=prefix.queue+anchor;
        client.lRange(qu,start,start+step-1).then((data,err) => {
            if(err) return ck && ck(err);
            return ck && ck(data);
        });
    },
    lenMap:function(anchor,ck){
        const main=prefix.data+anchor;
        client.hLen(main).then((n,err) => {
            if(err) return ck && ck(err);
            return ck && ck(parseInt(n));
        });
    },
    
    changeImgs:function(row,ck){
        if(!row.raw || !row.raw.imgs || !Array.isArray(row.raw.imgs) ||row.raw.imgs===0) return ck && ck(row);
        console.log(`Imgs [${row.raw.imgs.length}] on the raw data.`);

        const map={},len=row.raw.imgs.length;
        const skips={"http://":true,"https://":true};        //需要跳过的数据部分,线上存的就是图像链接
        let count=0;
        var cfg=config.image;

        for(let i=0;i<len;i++){
            const img=row.raw.imgs[i];
            const arr=img.split(";base64,");
            const type=arr[0].split(":image/");
            //console.log(`Orginal [${i}] : ${img.substr(0,200)}`);
            //console.log(`Prefix : ${arr[0]} , raw: ${arr[1].substr(0,200)}` );

            file.img(arr[1],i,type[1],function(index,target){
                //console.log(`img-${index} : ${cfg.server}${target}`);
                count++;

                if(!target.error){
                    map[index]=`${cfg.server}${target}`;
                }else{

                }

                if(count===len){
                    const list=[];
                    for(let j=0;j<len;j++) list.push(map[j]);
                    row.raw.imgs=list;
                    return ck && ck(row);
                }
            });
        }
    },
    cacheAnchor:function(anchor,block,data,ck){
        if(data!==null){
            return file.save(`${anchor}_${block}`,data,function(res){
                const result={anchor:anchor,block:block};
                if(res.error){
                    result.error= "Failed to save cache file.";
                    return ck && ck(result);
                }
                return ck && ck();
            });
        }
        return ck && ck();
    },
    setMap:function(anchor,block,origin,ck){
        delete origin.block;
        delete origin.empty;

        self.changeImgs(origin,function(row){
            const main= prefix.data+anchor;
            const result={anchor:anchor,block:block};
            //2.对数据进行压缩处理;
            let data=null;
            if(row.protocol && row.protocol.format && row.protocol.format.toLocaleUpperCase()==="JSON"){
                const dt=JSON.stringify(row.raw);
                if(dt.length>cfgCache.size) data=dt;
            }else{
                if(row.raw.length>cfgCache.size) data=row.raw;
            }
            
            if(data!==null) delete row.raw;
            self.cacheAnchor(anchor,block,data,function(){
                
                client.hSet(main,""+block,JSON.stringify(row)).then((res,err) => {
                    if (err) result.error= "Failed to set redis map.";
                    return ck && ck(result);
                });
            });
        });
    },
    getMap:function(anchor,block,ck){
        const main=prefix.data+anchor;
        client.hGet(main,""+block).then((dt,err) => {
            if (err || dt==null) return ck && ck(false);
            const result=JSON.parse(dt);
            if(!result.block) result.block=block;
            if(!result.owner) result.owner=result.signer;
            if(!result.raw){
                file.read(`${anchor}_${block}`,(res)=>{
                    if(result.protocol && result.protocol.format && result.protocol.format=="JSON"){
                        result.raw=JSON.parse(res);
                    }else{
                        result.raw=res;
                    }
                    return ck && ck(result);
                });
            }else{
                return ck && ck(result);
            }
        });
    },
    clean:function(anchor,ck){
        client.del(prefix.data+anchor);
        client.del(prefix.queue+anchor);

        //这里对file的缓存也进行清理

        return ck && ck(true);
    },    
};

exports.DB=self;
exports.FILE=file;