const solana=window.solanaWeb3;

const self={
    test_1:()=>{    //测试连接到Solana的节点
        const uri="http://127.0.0.1:8899";
        const connection = new solana.Connection(uri, "confirmed");
        console.log(connection.getBalance);
        connection.getBlockHeight().then((data)=>{
          console.log(data);
        });
        const addr="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
        connection.getBalance(addr).then((amount)=>{
            console.log(addr,amount);
        });
        //connection.getBalanc
    },
    test_2:()=>{    //Account创建账号
        //console.log(solana.Account);
        //const addr="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
        //const seed="12345678123456781234567812345678";
        const seed="";
        const pair=new solana.Account(seed);
        console.log(pair.publicKey.toBase58());
    },

    test_3:()=>{    //拉起Phantom的钱包

    },
    test_4:()=>{    //call一个部署的合约

    },
    test_5:()=>{    //Mint测试，获取到交易hash

    },
    test_6:()=>{    //部署数据到Accounts（template的模拟）

    },
}

const Solana_test= {
    auto:()=>{
        //self.test_1();
        self.test_2();
    },
    
}
export default Solana_test;