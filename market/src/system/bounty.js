/* 
*  Bounty management
*  @auth [ Fuu ]
*  @creator Fuu
*  @date 2024-07-07
*  @functions
*  1.manage bounty, saving on IndexedDB.
*  2.definition of bounty format.
*  3.definition of bounty apply progress.
*/

import INDEXED from "../lib/indexed";
import tools from "../lib/tools";
import Config from "./config";

const prefix = {          //anchor name prefix
    submit: "bounty_",
    payment: "pay_",
    apply: "apply_",
    distribe: "distribe_",
}

const process = {
    bounty: {
        "REMOVED": 0,          //bounty is removed         
        "ON_CHAIN": 2,          //bounty details is written on chain
        "LOCAL_SAVED": 3,          //bounty is saved locally
        "REPORTED": 4,          //bounty reported to system
        "NORMAL": 1,          //{after approved} bounty details approved, accepted
        "PAY_SUBMITTED": 5,          //bonus payment done, need to approve
        "PAYED": 6,          //{after approved} bonus is payed
        "ON_PROGRESS": 7,          //bounty is on progress
        "DONE": 8,          //bounty ended at the setting time
        "ALL_APPROVED": 9,          //bounty finished and all bonus done
    },
    apply: {
        "SUBMITTED": 2,        //bonus anchor submitted
        "FAILED": 4,        //invalid iNFT submission
        "APPROVED": 1,        //target iNFT approved
        "PAYED": 6,        //bonus payed after approved
    },
};

const funs = {
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
    randomPassword: (len) => {
        const n = !len ? 16 : len;
        return tools.char(n);
    },
}

const table = "bounty";
const self = {
    insert: (row, ck) => {
        funs.checkDB(table, (db) => {
            INDEXED.insertRow(db, table, [row], ck);
        });
    },
    get: (name, ck) => {
        funs.checkDB(table, (db) => {
            INDEXED.searchRows(db, table, "name", name, (arr) => {
                if (arr.length !== 1) return ck && ck({ error: "Failed to get bounty" });
                return ck && ck(arr[0]);
            });
        });
    },
    exsist: (name, ck) => {
        self.get(name, (res) => {
            if (res.error) return ck && ck(false);
            return ck && ck(true);
        });
    },
    list: (ck, filter, page, step) => {
        funs.checkDB(table, (db) => {
            INDEXED.pageRows(db, table, ck, { page: page, step: step })
        });
    },
    remove:(name,ck)=>{
        funs.checkDB(table, (db) => {
            if(db.error) return ck && ck(db);
            INDEXED.removeRow(db, table, "name", name, ck);
        });
    },
    update: {
        toChain: (name, ck) => {
            funs.checkDB(table, (db) => {

            });
        },
        toReported: (alink, ck) => {
            funs.checkDB(table, (db) => {
                INDEXED.searchRows(db, table, "name", alink, (rows) => {
                    if (rows.length !== 1) return ck && ck({ error: "Invalid bounty alink." });
                    rows[0].status = process.bounty.REPORTED;
                    INDEXED.updateRow(db, table, rows, ck);
                });
            });
        },
        toPayed: (name, alink, ck) => {
            console.log(name, alink);
            funs.checkDB(table, (db) => {
                INDEXED.searchRows(db, table, "name", name, (rows) => {
                    if (rows.length !== 1) return ck && ck({ error: "Invalid bounty alink." });
                    rows[0].payment = alink;
                    INDEXED.updateRow(db, table, rows, ck);
                });
            });
        },
        toSubmitted: (name, ck) => {

        },
    },
    convert: (raw, owner) => {
        const alink = raw.alink;
        const more = {
            title: "",
            desc: "",
            template: "",
            bonus: [],
            coin: "",
            start: 0,
            end: 0,
        };
        const data = self.format.local(alink, owner, more);

        data.status = raw.status;
        return data;
    },
    status: (cat, key) => {
        if (!process[cat]) return false;
        if (!process[cat][key]) return false;
        return process[cat][key];
    },
    format: {
        local: (alink, addr, more) => {      //more is the same as {format.raw.submit}
            const dt = tools.clone(more);
            dt.name = alink;
            dt.publisher = addr;
            dt.stamp = tools.stamp();
            return dt;
        },
        name: (type) => {
            if (!prefix[type]) return false;
            return `${prefix[type]}${tools.char(8).toLocaleLowerCase()}`;
        },
        raw: {
            submit: (publisher, more) => {
                const ndata = {
                    title: more.title,
                    desc: more.desc,
                    publisher: publisher,              //address of the bounty publisher 
                    consignee: more.consignee,         //address to accept the iNFT result.          
                    coin: more.coin,
                    template:more.template,
                    period: {
                        start: more.start,
                        end: more.end,
                    },
                    bonus: more.bonus,
                }
                if(more.contract) ndata.contract=more.contract;
                return ndata;
            },
            payment: (hash, target, amount) => {
                return {
                    block: hash,
                    bounty: target,
                    amount: amount,
                }
            },
            apply: (bounty, index, inft_link, network, address) => {
                return {
                    inft: inft_link,        //apply inft anchor link
                    bounty: {
                        target: bounty,      //bounty anchor link
                        bonus: index,       //bonus index
                    },
                    receiver: {
                        network: network,
                        address: address,
                    },
                    status: "apply",
                }
            },
            divert: (divert_link) => {
                return {
                    status: "divert",
                }
            },
            distribe: (apply_link, hash) => {
                return {
                    apply: apply_link,
                    transaction: hash,
                    status: "distribe",
                }
            },
        },
        protocol: {
            submit: () => {
                return {
                    fmt: "json",
                    type: "data",
                    tpl: "bounty",
                    app: "inft"
                };
            },
            payment: (bounty) => {
                return {
                    fmt: "json",
                    type: "data",
                    app: "inft",
                    ref: bounty,
                };
            },
            apply: (bounty) => {
                return {
                    fmt: "json",
                    type: "data",
                    app: "inft",
                    ref: bounty,
                };
            },
            divert: (bounty) => {
                return {
                    fmt: "json",
                    type: "data",
                    app: "inft",
                    ref: bounty,
                };
            },
            distribe: (bounty) => {
                return {
                    fmt: "json",
                    type: "data",
                    app: "inft",
                    ref: bounty,
                };
            },
        },
    },
}

export default self;