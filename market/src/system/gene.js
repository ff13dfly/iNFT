import INDEXED from "../lib/indexed";
import Config from "./config";

import tools from "../lib/tools";

const cache={}          //image cache
let active=null;        //active gene template

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
    format:()=>{
        const name=tools.char(10);
        return {
            name:name,
            size:[900,900],
            cell:[100,100],
            image:"",
            grid:[8,4],
            parts:[],
            series:[],
            deploy:[],
            stamp:tools.stamp(),
        };
    },
}

const table = "gene";
const self={
    list: (ck, page, step) => {
        funs.checkDB(table, (db) => {
            INDEXED.pageRows(db, table, ck, {page: page, step: step })
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
    active:(name,ck)=>{
        self.get(name,(res)=>{
            if(res.error) return ck && ck(res);
            
            //set the active gene template, update here.
            active=tools.clone(res);                    
        });
    },
    add:(ck)=>{
        const row=funs.format();
        funs.checkDB(table, (db) => {
            INDEXED.insertRow(db, table, [row], ck);
        });
    },
    update:{
        size:(name,width,height,ck)=>{

        },
        cell:(name,width,height,ck)=>{

        },
        grid:(name,x,y,ck)=>{

        },
        series:(name,arr,ck)=>{

        },
        image:(name,json,ck)=>{

        },
    },
}
export default self;