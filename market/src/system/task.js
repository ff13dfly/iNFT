/* 
*  Minting task management
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-09-02
*  @functions
*  1.task storage, saving on IndexedDB;
*  2.auto minting;
*/

import INDEXED from "../lib/indexed";
import Config from "./config";

import Account from "./account";
import Network from "../network/router";
import INFT from "./inft";
import tools from "../lib/tools";

const table = "task";
const callbacks={}      //task callbacks dock here, can be reset
const tags={}           //running tags here
const running={}        //running task dock here
let dog=null;

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
    watchdog:()=>{
        const stamp=tools.stamp();
        //console.log(JSON.stringify(running));
        for(var k in running){
            if(stamp-running[k]>10*1000){
                if(callbacks[k]) callbacks[k]({message:`Task status update.`,exit:true});
                delete running[k];
            }
        }
    }
}

const self={
    stop:(name)=>{
        tags[name]=true;            //set the stop tag;
        
        return true;
    },
    reset:(name)=>{
        delete(running[name]);
        return true;
    },
    running:(name)=>{
        //console.log(running[name],running);
        if(running[name]) return true;
        return false;
    },
    callback:(name,callback)=>{
        callbacks[name]=callback;
        return true;
    },
    start:(pass,name,callback)=>{
        if(dog===null){
            dog=setInterval(()=>{
                funs.watchdog()
            },3000);
        }

        callbacks[name]=callback;
        if(running[name]) return true;      //if task exsist, return true
        (()=>{
            let first=0;   //first auto fix amount
            const max=3;    //max fix tryes
            setTimeout(() => {
                self.get(name, (dt) => {
                    const ck=callbacks[name];
                    if (dt.error){
                        ck && ck({error:dt.error});
                        return false;
                    } 

                    ck && ck({message:"Task confirmed."});

                    const addr = dt.address;
                    Account.get(addr, (fs) => {
                        const ck=callbacks[name];
                        if (fs.length !== 1){
                            ck && ck({error:"Invalid sub account."})
                            return false;
                        }
                        ck && ck({message:"Checking balance of account."});

                        const chain = Network(dt.network);
                        chain.balance(addr, (balance) => {
                            const ck=callbacks[name];

                            if (balance.free < 10){
                                ck && ck({error:"Low balance of account."})
                                return false;
                            } 

                            ck && ck({message:"Decoding encried JSON account file."});
                            const chain = Network(dt.network);
                            chain.load(JSON.stringify(fs[0]), pass, (pair) => {
                                const ck=callbacks[name];
                                if (pair.error) {
                                    ck && ck({error:pair.error});
                                    return false;
                                }

                                let index = parseInt(dt.more.nonce) + 1;
                                const loop = (pair,ckLoop) => {
                                    const ck=callbacks[name];

                                    //a.prepare the anchor data;
                                    const prefix = dt.more.prefix;
                                    const anchor_name = `${prefix}${index}`;
                                    const raw = INFT.format.raw(dt.gene.cid, dt.offset);
                                    const protocol = INFT.format.protocol();
                                    const anchor = { anchor: anchor_name, raw: raw, protocol: protocol };

                                    ck && ck({message:`Minting: ${anchor_name}`});

                                    chain.write(pair, anchor, (process) => {
                                        if (process.error) {
                                            if(first<max){
                                                ck && ck({message:`Failed to write, auto fix.`});
                                                first++;
                                                return self.update.nonce(name,index+1,()=>{
                                                    first=false;
                                                    return loop(pair);
                                                });
                                            }else{
                                                ck && ck({error:process.error});
                                                delete tags[name];
                                                delete running[name];
                                                delete callbacks[name];
                                                return false;
                                            }
                                        }

                                        ck && ck({message:process.msg});

                                        //b.operation after finalized
                                        if (process.status === "Finalized") {
                                            //console.log(running);
                                            running[name]=tools.stamp();

                                            first=false; 
                                            if (process.hash) ck && ck({hash:process.hash});

                                            //1.update the nonce of minting
                                            self.update.nonce(name, index, (res) => {
                                                if (res.error){
                                                    ck && ck({error:res.error})
                                                    return false;
                                                }

                                                ck && ck({nonce:index});

                                                if (tags[name] === true) {
                                                    delete tags[name];
                                                    delete running[name];
                                                    ck && ck({message:`Task abord.`,exit:true});
                                                    delete callbacks[name];
                                                    return false;
                                                } else {
                                                    index++;
                                                    return setTimeout(()=>{
                                                        loop(pair);
                                                    },300);
                                                }
                                            });
                                        }
                                    });
                                }
                                running[name]=tools.stamp();     //set running tag
                                loop(pair);     //run the loop
                            });
                        });
                    });
                });
            },300);     //wait 300ms to start the running
        })(pass,name);
    },
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
        offset:(name,offset,ck)=>{
            funs.checkDB(table, (db) => {
                INDEXED.searchRows(db, table, "name", name, (rows) => {
                    if (rows.length !== 1) return ck && ck({ error: "Invalid task." });
                    rows[0].offset = offset;
                    INDEXED.updateRow(db, table, rows, ck);
                });
            });
        },
        gene:(name,cid,ck)=>{
            funs.checkDB(table, (db) => {
                INDEXED.searchRows(db, table, "name", name, (rows) => {
                    if (rows.length !== 1) return ck && ck({ error: "Invalid task." });
                    rows[0].gene.cid = cid;
                    INDEXED.updateRow(db, table, rows, ck);
                });
            });
        },
        nonce:(name,n,ck)=>{
            funs.checkDB(table, (db) => {
                INDEXED.searchRows(db, table, "name", name, (rows) => {
                    if (rows.length !== 1) return ck && ck({ error: "Invalid task." });
                    rows[0].more.nonce = n;
                    INDEXED.updateRow(db, table, rows, ck);
                });
            });
        },
    },
}
export default self;