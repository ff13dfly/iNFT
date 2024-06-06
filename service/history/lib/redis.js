const redis = require('redis');
const client = redis.createClient();
client.connect();

const self={
    exsistKey:(key,ck)=>{
        client.exists(key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    getKey:(key,ck)=>{
        client.get(key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    setKey:(key,value,ck)=>{
        client.set(key,value).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    setHash:(main,key,val,ck)=>{
        client.hSet(main,key,val).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    getHash:(main,key,ck)=>{
        client.hGet(main,key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    keys:(prefix,ck)=>{
        client.keys(prefix).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    remove:(key,ck)=>{
        client.del(key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },

    setPage:(key,n,ck)=>{
        client.set(key,n).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    getPage:(key,ck)=>{
        client.get(key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(isNaN(res)?0:parseInt(res));
        });
    },
};

exports.REDIS=self;