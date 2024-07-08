import tools from "../lib/tools";
import Local from "../lib/local";
import INDEXED from "../lib/indexed";

import Config from "./config";
import Network from "../network/router";

const funs = {
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
        const cfg = Config.get(["storage"]);
        const table="accounts";
        INDEXED.checkDB(cfg.DBname, (db) => {
            const tbs = db.objectStoreNames;
            if (!funs.checkTable(table, tbs)) {
                const tb = tools.clone(cfg.tables[table]);
                console.log(tb);
                tb.table=table;
                db.close();         //must close, or the DB is blocked
                INDEXED.initDB(cfg.DBname, [tb], db.version + 1).then((ndb) => {
                    INDEXED.insertRow(ndb, table, [row],ck);
                }).catch((error) => {
                    return ck && ck({ error: "failed to init indexDB" });
                });
            } else {
                INDEXED.insertRow(db, table, [row],ck);
            }
        });
    },
}

const self = {
    generate: (network, ck) => {
        const gen = Network(network);
        if (gen === false) return ck && ck(false);
        const pass = funs.randomPassword();

        gen.generate(pass, (row) => {
            //1.saving the password to config
            Config.set(["account", "password", row.address], pass);

            //2.insert the address data to indexedDB
            row.stamp = tools.stamp();
            funs.insertToDB(row, (res) => {
                console.log(res);
            });
        });
    },

    list: (filter, ck, page, step) => {

    },
}

export default self;