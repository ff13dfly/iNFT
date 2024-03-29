import {Aptos,AptosConfig,Network} from "@aptos-labs/ts-sdk";

const self={
    test_1:()=>{    //连接到目标网络，并获取到基础数据
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);
        //console.log(aptos);
        aptos.getLedgerInfo().then((res)=>{
            console.log(aptos.getAccountInfo);

            const hash="0x37b6d7677b65520139e1749157b319a424608b7e0b80dcf20044cb610537c632";
            aptos.getAccountInfo({ accountAddress:hash }).then((obj)=>{
                console.log(obj);
            });
        }).catch((error)=>{
            console.log(error);
        });
    },
    test_block_hash:()=>{
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);
        console.log(aptos);
        const block=409021;
        //const hash="0x34a71c1f9e35656a05ab135180fab871303bd2e86fb742e1febf58be8f7ae8b1";
        aptos.getBlockByHeight({blockHeight:block}).then((res)=>{
            console.log(res);
        }).catch((error)=>{
            console.log(error);
        });
    },
    test_height:()=>{
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);
        console.log(aptos);
        //const block=409021;
        //const hash="0x34a71c1f9e35656a05ab135180fab871303bd2e86fb742e1febf58be8f7ae8b1";
        // aptos.getName({name:Network.DEVNET}).then((res)=>{
        //     console.log(res);
        // }).catch((error)=>{
        //     console.log(error);
        // });
    },
}

const AptOS_test= {
    auto:()=>{
        //self.test_1();
        //self.test_block_hash();
        self.test_height();
    },
}
export default AptOS_test;