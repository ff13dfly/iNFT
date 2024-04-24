module.exports={
  slide:[
    {
      title:"Identifiable NFT",
      desc:"NFT can be identified by human eyes.",
      thumb:"imgs/Banner_01.jpg",
    },
    {
      title:"Scarcity of Mathematics",
      desc:"Scarcity base on blockchain hash only.",
      thumb:"imgs/Banner_02.jpg",
    },
  ],
  points:[
    {
      title:"Identifiable",
      desc:"可以肉眼识别.",
      thumb:"imgs/p_name_service.jpg",
    },
    {
      title:"不可预测的hash",
      desc:"基于区块链的不可预测的hash",
      thumb:"imgs/p_key_value.jpg",
    },
    {
      title:"公开公平",
      desc:"公开公平的规则，不可篡改的发布",
      thumb:"imgs/p_linked_list.jpg",
    },
    {
      title:"有趣的图层组合",
      desc:"基于图层组合来生成NFT图像.",
      thumb:"imgs/p_anchor_link.jpg",
    },
    {
      title:"极小图像资源",
      desc:"只依赖一张图片来进行组合",
      thumb:"imgs/p_easy_protocol.jpg",
    },
    {
      title:"多种玩法",
      desc:"基于各种Web3.0各种玩法，可以进行配套和辅助",
      thumb:"imgs/p_full_chain.jpg",
    }
  ],
  protocol:{
    subject:{
      title:"灵活的图层组合",
      desc:"A simple protocol to group Web3.0 resource.",
      background:"imgs/protocol.jpg",
    },
    list:[
      {
        title:"单一资源图像",
        sub:"Only loader needed to run the dApps.",
      },
      {
        title:"多块灵活组合",
        sub:"Pretty simple way to link resource on chain.",
      },
      {
        title:"叠加玩法",
        sub:"A way to hide blockchain data.",
      },
    ]
  },
  loader:{
    subject:{
      desc:[
        "肉眼可识别的NFT，是基于图像的设计和组合",
        "依赖数学的随机性，来确定稀缺性",
        "只能通过PoW的方式来获取稀缺性的NFT"
      ],
      background:"imgs/loader.png",
    },
    frontend:{
      title:"稀缺性样例1",
      desc:"By deploy the loader of frontend, you can run Anchor application directly by html hash. It is a simple way, the url as follow :",
      code:"loader.html#hello@wss://dev.metanchor.net",
    },
    backend:{
      title:"稀缺性样例2",
      desc:"The backend need NodeJS support, please make sure your system can run NodeJS properly.",
      code:"node loader.js anchor://hello/",
    }
  },
  plinth:{
    subject:{
      title:"自洽体系",
      desc:"Your Web3.0, You can load it anywhere.",
      background:"imgs/plinth.jpg",
    },
    list:[
      {
        title:"自由交易",
        sub:"iNFT的编辑器.",
      },
      {
        title:"自主定价",
        sub:"iNFT的铸造工具.",
      },
      {
        title:"多链实现",
        sub:"iNFT的交易市场.",
      },
    ]
  },
  demo:[
    {
      title:"Editor",
      desc:"iNFT的编辑器，可以从一张图片上创建iNFT",
      thumb:"imgs/d_plinth.jpg",
      link:"http://loader.metanchor.net/#plinth@wss://dev.metanchor.net",
    },
    {
      title:"Minter",
      desc:"iNFT铸造工具，简单易用的，免钱包模式",
      thumb:"imgs/d_freesaying.jpg",
      link:"http://loader.metanchor.net/#freesaying@wss://dev.metanchor.net",
    },
    {
      title:"Market",
      desc:"自由的iNFT交易市场，多链支持",
      thumb:"imgs/d_vbw.jpg",
      link:"http://loader.metanchor.net/#document@wss://dev.metanchor.net",
    },
  ],
  gateway:{
    title:"多种创新玩法",
    details:[
      "The micro-server framework for Anchor network.",
      "Javascript is the only language you need to know.",
      "Easy to deploy and recover the whole system.",
    ],
    background:"imgs/gateway.jpg",
  },
  sample:{
    desc:[
      "公平不可操控的发行方式，天生可以应用在某些领域",
      "尤其是和Web3.0的玩法结合，很有趣",
    ],
    list:[
      {
        title:"捐赠玩法",
        desc:"The UI of Gateway to manage the whole micro-service system.",
        thumb:"imgs/gateway_ui.jpg",
      },
      {
        title:"空投玩法",
        desc:"The entry application to organize the vService and expose APIs to dApps.",
        thumb:"imgs/gateway_hub.jpg",
      },
      {
        title:"资产盘活",
        desc:" Micro-service, the implement of complex logical, simple and stable.",
        thumb:"imgs/gateway_vservice.jpg",
      },
    ]
  },
};