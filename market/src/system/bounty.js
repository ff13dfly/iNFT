import INDEXED from "../lib/indexed";
import tools from "../lib/tools";

import Config from "./config";

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
}

const table="bounty";
const self = {
    insert:(row,ck)=>{
        funs.checkDB(table,(db)=>{
            INDEXED.insertRow(db, table, [row],ck);
        });
    },
    get:(name,ck)=>{
        funs.checkDB(table,(db)=>{
            INDEXED.searchRows(db,table,"name",name,ck);
        });
    },
    list: (ck,filter,page,step) => {
        funs.checkDB(table,(db)=>{
            INDEXED.pageRows(db,table,ck,{page:page,step:step})
        });
    },
    status:{
        toChain:(name,ck)=>{

        },
        toSystem:(name,ck)=>{

        },
        toProgress:(name,ck)=>{

        },
        toDone:(name,ck)=>{

        },
    },
}

export default self;