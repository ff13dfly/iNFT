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
    remove:(key,ck)=>{
        client.del(key).then((res,err) => {
            if(err) return ck && ck(err);
            return ck && ck(res);
        });
    },
    pushQueue:(queue,value,ck,left)=>{
        if(left){
            client.lPush(queue,value).then((res,err) => {
                if(err) return ck && ck(err);
                return ck && ck(true);
            });
        }else{
            client.rPush(queue,value).then((res,err) => {
                if(err) return ck && ck(err);
                return ck && ck(true);
            });
        }
    },
    test:()=>{
        console.log(client);
    },
};

exports.REDIS=self;