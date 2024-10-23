import INDEXED from "../lib/indexed";
import Config from "./config";

import tools from "../lib/tools";

/* Gene template management */
//1.manage gene, saving on IndexedDB.
//2.definition of gene data format;   

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
    format:{
        gene:()=>{
            const name=tools.char(10);
            return {
                name:name.toLocaleLowerCase(),
                size:[900,900],
                cell:[100,100],
                grid:[8,4],
                title:"",
                desc:"",
                parts:[],
                series:[],
                deploy:[],                  
                stamp:tools.stamp(),
                type:2,
                version:"2024_flamingo",
                image:"",
            };
        },
        series:()=>{
            return {
                name:"",
                desc:"",
            }
        },
        part:()=>{
            return {
                value:[16,2,6,0],
                img: [0, 3, 0, 0],
                position:[100,100],
                center: [0, 0],
                rotation:[0],
                rarity:[],
            }
        }
    },
    save:(full,ck)=>{
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.updateRow(db, table, [full], ck);
        });
    },
}

const table = "gene";
const self={
    list: (ck, page, step) => {
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.pageRows(db, table, ck, {page: page, step: step })
        });
    },
    get:(name,ck)=>{
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.searchRows(db, table, "name", name, (arr) => {
                if(db.error) return ck && ck(db);
                if (arr.length !== 1) return ck && ck({ error: "Failed to get bounty" });
                return ck && ck(arr[0]);
            });
        });
    },
    add:(ck)=>{
        const row=self.format();
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.insertRow(db, table, [row], ck);
        });
    },
    remove:(name,ck)=>{
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.removeRow(db, table, "name", name, ck);
        });
    },
    format:(type)=>{
        const key=!type?"gene":type;
        if(!funs.format[key]) return {error:"Invalid format type."};
        return funs.format[key]();
    },
    active:(name,ck)=>{
        self.get(name,(res)=>{
            if(res.error) return ck && ck(res);
            active=tools.clone(res);                    
        });
    },
    update:{
        title:(name,title,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.title=title;
                funs.save(data,ck);
            });
        },
        desc:(name,desc,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.desc=desc;
                funs.save(data,ck);
            });
        },
        image:(name,bs64,ck)=>{
            console.log(name,bs64);
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.image=bs64;
                funs.save(data,ck);
            });
        },
        size:(name,width,height,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.size=[width,height];
                funs.save(data,ck);
            });
        },
        cell:(name,width,height,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.cell=[width,height];
                funs.save(data,ck);
            });
        },
        grid:(name,x,y,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.grid=[x,y];
                funs.save(data,ck);
            });
        },
        parts:(name,arr,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.parts=arr;
                funs.save(data,ck);
            });
        },
        series:(name,arr,ck)=>{
            self.get(name,(data)=>{
                if(data.error) return ck && ck(data);
                data.series=arr;
                funs.save(data,ck);
            });
        },
    },
}
export default self;