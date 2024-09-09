import INDEXED from "../lib/indexed";
import Config from "./config";

import tools from "../lib/tools";

const table = "task";
const funs={
    checkDB: (table, ck) => {
        const cfg = Config.get(["storage"]);
        INDEXED.checkDB(cfg.DBname, (db) => {
            const tbs = db.objectStoreNames;
            if (!funs.checkTable(table, tbs)) {
                const tb = tools.clone(cfg.tables[table]);
                tb.table = table;
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
    format:{
        task:(address)=>{
            const name=`task_${tools.char(8).toLocaleLowerCase()}`;
            return {
                name:name,
                gene:{
                    cid:"bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4",          //default treasure tree
                    orgin:"web3.storage",
                },
                offset:[],
                network:"anchor",
                address:address,
                more:{
                    prefix:`${tools.char(5).toLocaleLowerCase()}_`,
                    nonce:0,
                },
                stamp:tools.stamp(),
            };
        }
    },
}


const self={
    list: (ck, page, step) => {
        return funs.checkDB(table, (db) => {
            return INDEXED.pageRows(db, table, ck, {page: page, step: step })
        });
    },
    get:(name,ck)=>{
        funs.checkDB(table, (db) => {
            INDEXED.searchRows(db, table, "name", name, (arr) => {
                if (arr.length !== 1) return ck && ck({ error: "Failed to get bounty" });
                return ck && ck(arr[0]);
            });
        });
    },
    add:(address,ck)=>{
        return funs.checkDB(table, (db) => {
            const row=funs.format.task(address);
            return INDEXED.insertRow(db, table, [row], ck);
        });
    },
    remove:(name,ck)=>{
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.removeRow(db, table, "name", name, ck);
        });
    },
    update:{
        
    },
}
export default self;