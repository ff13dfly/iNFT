const tools = require("./lib/tools.js");
const IO = require("./lib/file.js");
const { output } = require("./lib/output.js");

const args = process.argv.slice(2);
const config_file=!args[0]?"config.json":args[0];


const self={
    init:(ck)=>{
        IO.read(config_file,(data)=>{
            if(data.error) return ck && ck({error:"Failed to load config file."});
            try {
                const config=JSON.parse(data);
                return ck && ck(config);
            } catch (error) {
                return ck && ck({error:"Failed to parse config file."});
            }
        });
    },
};

self.init((cfg)=>{
    if(cfg.error) return output(`Error to load config file: ${config_file}`,"error",true);
    console.log(cfg);
});