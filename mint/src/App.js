import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

import Data from "./lib/data";
import Local from "./lib/local";
import Chain from "./lib/chain";
import config from "./config";

import plugin from "./lib/plugin";

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

  const QR={
    view:(anchor)=>{
      console.log(anchor);
      setTitle("iNFT viewer");
      setContent("hello");
      setShow(true);
    },
    template:(cid)=>{
      setTitle("iNFT template previewer");
      setContent("template here");
      setShow(true);
    },
  }


  const self = {
    dialog: (ctx, title) => {
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
    fresh: (force) => {
      if (force) return self.start();
      update++;
      setUpdate(update);
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
          tags: [],
          multi:1,
          offset:[],    //minter default offset
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
    checking:()=>{
      const req=window.location.hash;
      if(!req) return true;
      plugin.run("template",["aa","bb"]);
    },
    regQR:()=>{
      for(var key in QR){
        plugin.reg(key,QR[key]);
      }
      console.log(`QR function set successful.`);
      return true;
    },
    start: () => {
      //1.check network status;

      //2.get target template;
      const tpl = self.getTemplate();
      //console.log(`Force to fresh template`);
      if(!Data.exsistHash("cache",tpl)){
        //console.log(`Not cached template`);
        IPFS.read(tpl, (json) => {
          json.cid=tpl;
          Data.set("template", json);         //set to default template
          Data.setHash("cache", tpl, json);   //set to cache
          self.fresh();
        });
      }else{
        //console.log(`Cached template`);
        const def=Data.getHash("cache", tpl);
        def.cid=tpl;
        Data.set("template", def);
        self.fresh();
      }
    },
  }

  
  useEffect(() => {
    self.regQR();

    //0.checking the hash to confirm next action.
    self.checking();

    //1.linke to server to fresh the iNFT result
    Chain.link(config.node[0], (API) => {
      self.start();
    });
  }, []);

  return (
    <Container className="app" id="minter">
      <Header fresh={self.fresh} dialog={self.dialog} update={update} />
      <Preview fresh={self.fresh} update={update} node={config.node[0]} />
      <Action fresh={self.fresh} dialog={self.dialog} update={update} countdown={self.countdown} />
      <Modal dialogClassName="modal-minter" show={show} size="lg" backdrop="static" onHide={
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
