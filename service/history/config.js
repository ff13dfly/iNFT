exports.config = {
    "name":"history",
    "node":"wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network",
    "autosaving":60000,             //autosaving interval, cache the anchors on
    "folder":"cache",               //local cache folder
    "low":2000000000000,            //balance low than this, failed to faucet
    "server": {
        "protocol":"http",
        "port": 7766,
        "address": "127.0.0.1"       //api.w3os.net
    },
    "keys":{
        "index":"current_index",
        "all":"all_NFT_list",
        "prefix":{              //queue prefix, can use this to remove all
            "history":"his_",           //history queue
            "template":"tpl_",          //template queue prefix
            "account":"acc_",
            "block":"block_",
        }
    }
};