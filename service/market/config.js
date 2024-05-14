exports.config = {
    'name':'template',
    'node':'wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network',
    'folder':"cache",
    'autosaving':60000,
    'low':2000000000000,            //balance low than this, failed to faucet
    'server': {
        'protocol':'http',
        'port': 8866,
        'address': '127.0.0.1'       //faucet.w3os.net
    },
};