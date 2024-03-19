import {Aptos,AptosConfig,Network} from "@aptos-labs/ts-sdk";

const self={
    test_1:()=>{    //连接到目标网络，并获取到基础数据
        const aptosConfig = new AptosConfig({ network: Network.DEVNET });
        const aptos = new Aptos(aptosConfig);
        console.log(aptos);
        aptos.getLedgerInfo().then((res)=>{
            console.log(aptos.getAccountInfo);

            const hash="0x37b6d7677b65520139e1749157b319a424608b7e0b80dcf20044cb610537c632";
            aptos.getAccountInfo({ accountAddress:hash }).then((obj)=>{
                console.log(obj);
            });
        });
    },
}

const AptOS_test= {
    auto:()=>{
        self.test_1();
    },
    
}
export default AptOS_test;