exports.config = {
    'vname':'airdrop',
    //'node':'wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network',
    'node':'ws://127.0.0.1:9944',       //test  
    'account':[     //select the account by day%account.length
        ['5GnaMMdmqFrUWpDsiC2FXotJ4cwnQcMDKCnygo8CviDGDsHd','123456'],
        ['5GnaMMdmqFrUWpDsiC2FXotJ4cwnQcMDKCnygo8CviDGDsHd','123456'],
        ['5GnaMMdmqFrUWpDsiC2FXotJ4cwnQcMDKCnygo8CviDGDsHd','123456'],
    ],
    'cache':'record.json',
    'autosaving':60000,
    'low':2000000000000,            //balance low than this, failed to faucet
    'server': {
        'protocol':'http',
        'port': 8888,
        'address': '127.0.0.1'       //faucet.w3os.net
    }, 
    'amount':{
        'single':100000,         //单账号最多获取的coin数
        //'first':[10000,50000],  //1~5 $INFT
        'first':[1000,9000],  //1~5 $INFT
        'normal':[1000,8000],   //0.1~0.8 $NFT
    }
};