exports.config = {
    'vname':'airdrop',
    'polkadot':'wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network',
    'account':'5GnaMMdmqFrUWpDsiC2FXotJ4cwnQcMDKCnygo8CviDGDsHd',
    //'password':'123456',
    'server': {
        'protocol':'http',
        'port': 8888,
        'address': '127.0.0.1'       //faucet.w3os.net
    }, 
    'amount':{
        'single':100000,         //单账号最多获取的coin数
        'first':[10000,50000],  //1~5 $INFT
        'normal':[1000,8000],   //0.1~0.8 $NFT
    }
};