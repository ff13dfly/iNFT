/* read local file
 *  auth: Fuu
 *  date: 2024-10-3
 */
const fs = require("fs");
const file = {
    read: (target, ck, toJSON, toBase64) => {
        fs.stat(target, (err, stats) => {
            if (err) return ck && ck({ error: err });
            if (!stats.isFile()) return ck && ck(false);
            fs.readFile(target, (err, data) => {
                if (err) return ck && ck({ error: err });
                if (toBase64) return ck && ck(data.toString("base64"));
                if (!toJSON) return ck && ck(data.toString());
                try {
                    const str = data.toString();
                    const json = JSON.parse(str);
                    return ck && ck(json);
                } catch (error) {
                    return ck && ck({ error: "Invalid JSON file." });
                }
            });
        });
    },
    save:(name,data,ck,folder)=>{
        const path=!folder?`./`:`./${folder}`;
        if(!fs.existsSync(path)) fs.mkdirSync(path,{recursive:true});
        const target = `${path}/${name}`;
        fs.writeFile(target, data, "utf8", function (err) {
            if (err) return ck && ck({ error: err });
            return ck && ck(true);
        });
    },
};

module.exports = file;