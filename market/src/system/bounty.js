import INDEXED from "../lib/indexed";
import tools from "../lib/tools";

import Config from "./config";
import Network from "../network/router";

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

const self = {
    insert:(row,ck)=>{
        const table="bounty";
        funs.checkDB(table,(db)=>{
            INDEXED.insertRow(db, table, [row],ck);
        });
    },
    get:(name,ck)=>{

    },
    list: (ck,filter,page,step) => {
        const table="bounty";
        funs.checkDB(table,(db)=>{
            INDEXED.pageRows(db,table,ck,{page:page,step:step})
        });
    },
}

export default self;