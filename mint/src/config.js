module.exports = {
    network:"anchor",
    //network:"tanssi",
    //network:"sui",
    node:[
        //"wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network",
        //"wss://wss.android.im",
        "ws://127.0.0.1:9944",
        //"wss://dev3.metanchor.net",
    ],
    default:[
        "bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4",  //BTC tree
        //"bafkreiddy2rqwebw5gm5hdqqqrbsqzkrubjk3ldzr2bia5jk4w5o2w5w4i",  //APE
        //"bafkreihze725zh5uqcffao5w27qdmaihjffjzj3wvtdfjocc33ajqtzc7a",  //Solana logo
        //"anchor://single/265468",
        //"anchor://aabb/217148",
    ],
    faucet:{
        tanssi:"https://faucet.w3os.net",
        anchor:"https://faucet.w3os.net",
    },
    bounty:{
        url:"http://localhost:6868",
        source:{
            name:"inftbounty",
            publisher:"5FQmGPk7qGBmU3K6kDfMSBiUHBYq5NqXpx93KFEvDvyz5sRJ",
        },
    },
    market:[
        {
            domain:"localhost/iNFT/service/api/",
            protocol:"http://",
            partten:"php",
            orgin:"W3OS",
            lang:"php",
            desc:"",
            funs:"",
            def:"",                 //get the definition of API (JSON format)
        },
        {
            domain:"api.inft.w3os.net",
            protocol:"https://",
            partten:"php",
            orgin:"W3OS",
            lang:"php",
            desc:"",
            funs:"",
            def:"",                 //get the definition of API (JSON format)
        },
    ],
    agent:{
        inft:[
            "wss://wss.android.im",
        ],
        template:[
            "https://ipfs.w3os.net/"
        ],
    },
    unit:{
        anchor:"$ANK",
        tanssi:"$INFT",
    },
    proxy:true,             //system default proxy setting
    version:20240103,
}