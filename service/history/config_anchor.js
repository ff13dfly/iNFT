exports.config = {
    "name":"history",
    //"node":"wss://dev2.metanchor.net",
    "node":"ws://localhost:9944",
    "redis":{
        "host":"localhost",
        "port":6379,
        "auth":"",
    },
    "keys":{
        "status":"current_index",    //kv value, the block
        "all":"all_NFT_list",
        "prefix":{              //queue prefix, can use this to remove all
            "history":"his_",           //history queue
            "template":"tpl_",          //template queue prefix
            "account":"acc_",
            "block":"block_",
            "raw":"ank_",               //raw anchor data
        }
    },
    "version":"2.0.0",
    "update":"2024.9",
    "auth":"Fuu",
};