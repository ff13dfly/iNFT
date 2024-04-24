import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

import Data from "./lib/data";
import Local from "./lib/local";
import Chain from "./lib/chain";
import config from "./config";

import IPFS from "./network/ipfs";
import Sui from "./network/sui";
import tools from "./lib/tools";

// iNFT definition
// anchor://aabb/217148
let subs = {};            //加载订阅的方法

function App() {

  const size = {
    row: [12],
    side: [6, 3, 3],
  };

  let [update, setUpdate] = useState(0);
  let [show, setShow] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  const self = {
    dialog: (ctx, title) => {
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
    fresh: (force) => {
      update++;
      setUpdate(update);
      if (force) self.start();
    },
    subscribe: (key, fun) => {
      subs[key] = fun;
    },
    getTemplate: () => {
      const ts = Local.get("template");
      if (!ts) {
        const data = []
        data.push({
          alink: config.default[0],
          name: "",
          tags: []
        })
        Local.set("template", JSON.stringify(data));
        return config.default[0];
      }
      try {
        const tpls = JSON.parse(ts);
        if (tpls[0] && tpls[0].alink) return tpls[0].alink
        return config.default[0];
      } catch (error) {
        return config.default[0];
      }
    },
    countdown: () => {
      //console.log(`Ready to countdown 18s`);
      let n = 9;
      const tt = setInterval(() => {
        if (n <= 0) return clearInterval(tt);
        n--;
      }, 1000);
    },
    start: () => {
      const tpl = self.getTemplate();
      IPFS.read(tpl, (json) => {
        Data.set("template", json);         //set to default template
        Data.setHash("cache", tpl, json);   //set to cache
        self.fresh();
      });
    },
  }

  useEffect(() => {
    //1.连接服务器
    // Chain.link(config.node[0], (API) => {
    //   self.start();
    // });
    const target='0xd0e626176c05ae3aff2e06719de40367b5bfa37821f5db5b8ea0921ec0260422::bird_nft::mint_to_sender';
    //const args=["param_a","param_b","param_c"];
    const args=[];

    const network="testnet";

    //0x306ebe228a984679f0815e7c07fa88c2569f519738838d2108ca6a608b435fe2

    //0x49d80ed919e21bea6377e5d6e3c3823ee817657be4b82762cfcab78e3b15f2cd
    //235,141,120,111,66,11,61,126,72,73,171,204,161,211,64,247,168,85,167,128,48,179,126,138,226,185,220,122,146,61,255,
    //189,149,68,2,157,228,110,35,152,131,49,186,191,219,77,219,224,26,251,163,136,186,61,65,104,120,73,123,87,11,241,135,114
    const signer_private="eb8d786f420b3d7e4849abcca1d340f7a855a78030b37e8ae2b9dc7a923dffbd";
    const signer_address="0x49d80ed919e21bea6377e5d6e3c3823ee817657be4b82762cfcab78e3b15f2cd";

    // Sui.airdrop("0x90d37594861698c9e9e2a6726d1fd7f24945093cc9864cf47752908f0c9f15a9",0,(res)=>{
    //   console.log(res);
    // },network);

    //6eENLu9nsEBy6nzpGByXuJFza5RjTbUSoLKVucKju23A
    Sui.recover(tools.hexToU8(signer_private),(acc)=>{
      const contract="0xd0e626176c05ae3aff2e06719de40367b5bfa37821f5db5b8ea0921ec0260422::bird_nft::mint_to_sender";
      const args=["cc","dd","ee"];
      console.log(acc.raw.keypair);
      Sui.run(contract,args,acc.raw.keypair,()=>{

      },network);
    });

    // Sui.view(signer_address,"balance",(res)=>{
    //   console.log(res);
    // },network);
  }, []);

  const cmap = {
    maxWidth: "450px",
  }

  const mmap = {
    maxWidth: "450px",
    margin: "0 auto",
    display: 'block',
    //position: "relative"
    //position: 'initial'
  }

  return (
    <Container style={cmap}>
      <Header fresh={self.fresh} dialog={self.dialog} update={update} />
      <Preview fresh={self.fresh} update={update} node={config.node[0]} />
      <Action fresh={self.fresh} dialog={self.dialog} update={update} countdown={self.countdown} />
      <Modal style={mmap} show={show} size="lg" backdrop="static" onHide={
        (ev) => {
          setShow(false);
        }
      }
        centered={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {content}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;
