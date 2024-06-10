exports.config = {
    'name':'history',
    'node':'wss://dev2.metanchor.net',
    'redis':{
        'host':'localhost',
        'port':6379,
        'auth':'',
    },
    'keys':{
        'index':'current_index',
        'all':'all_NFT_list',
        'prefix':{              //queue prefix, can use this to remove all
            'history':'his_',           //history queue
            'template':'tpl_',          //template queue prefix
            'account':'acc_',
            'block':'block_',
        }
    }
};