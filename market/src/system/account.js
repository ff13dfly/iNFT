import INDEXED from "../lib/indexed";
import tools from "../lib/tools";

import Config from "./config";
import Network from "../network/router";

let cache=null      //cache the account

const table="accounts";
const funs = {
    checkDB:(table,ck)=>{
        const cfg = Config.get(["storage"]);
        INDEXED.checkDB(cfg.DBname, (db) => {
            const tbs = db.objectStoreNames;
            if (!funs.checkTable(table, tbs)) {
                const tb = tools.clone(cfg.tables[table]);
                tb.table=table;
                db.close();         //must close, or the DB is blocked
                INDEXED.initDB(cfg.DBname, [tb], db.version + 1).then((ndb) => {
                    return ck && ck(ndb);
                }).catch((error) => {
                    return ck && ck({ error: "failed to init indexDB" });
                });
            } else {
               return ck && ck(db);
            }
        });
    },
    checkTable: (from, list) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] === from) return true;
        }
        return false;
    },
    randomPassword: (len) => {
        const n = !len ? 16 : len;
        return tools.char(n);
    },
    insertToDB: (row, ck) => {
        funs.checkDB(table,(db)=>{
            INDEXED.insertRow(db, table, [row],ck);
        });
    }
}

const self = {
    map:(ck)=>{
        self.list({},(arr)=>{
            if(cache===null) cache={};
            for(let i=0;i<arr.length;i++){
                const row=arr[i];
                cache[row.address]=true;
            }
            return ck && ck();
        });
    },
    get:(addr,ck)=>{
        console.log(addr,table);
        funs.checkDB(table,(db)=>{
            INDEXED.searchRows(db,table,"address",addr,ck);
        });
    },
    check:(addr,ck)=>{
        if(cache===null) return self.map(()=>{
            self.check(addr,ck);
        });
        if(cache[addr]) return ck && ck(true);
        return ck && ck(false);
    },
    exsist:(addr,ck)=>{
        if(cache===null) return self.map();
        if(cache[addr]) return true;
        return false;
    },

    list: (filter, ck, page, step) => {
        funs.checkDB(table,(db)=>{
            INDEXED.pageRows(db,table,ck,{page:page,step:step})
        });
    },
    add:(row,ck)=>{
        row.stamp = tools.stamp();
        const address=row.address;
        self.get(address,(arr)=>{
            if(arr.length!==0) return ck && ck({error:"Account exsist."});
            funs.insertToDB(row, (res) => {
                if(res!==true) return ck && ck({error:"Failed to insert to indexeDB."});
                return ck && ck(res);
            });
        });
        
    },
    
    import:(pass,row,ck)=>{
        //console.log(pass,row);
        //0.check wether loaded;

        //1.saving the password to config
        Config.set(["account", "password", row.address], pass);

        //2.insert the address data to indexedDB
        row.stamp = tools.stamp();
        funs.insertToDB(row, (res) => {
            if(res!==true) return ck && ck({error:"Failed to insert to indexeDB."});
            return ck && ck(res);
        });
    },
    
    balance:(list,ck,net)=>{
        const chain = Network(!net?"anchor":net);
        const div=chain.divide();
        if(Array.isArray(list)){
            let working=0;
            const map={};
            for(let i=0;i<list.length;i++){
                const address=list[i];
                working++;
                chain.balance(address,(res)=>{
                    working--;
                    map[address]=parseFloat(parseInt(res.free)/div);
                    if(working<1) return ck && ck(map);
                });
            }
        }else{
            chain.balance(list,ck);
        }
    },
}

export default self;