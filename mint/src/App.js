import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/preview";
import Action from "./component/action";
import Header from "./component/header";

import Viewer from "./component/viewer";
import Detail from "./component/detail";

import Data from "./lib/data";
import Local from "./lib/local";
import Chain from "./lib/chain";
import config from "./config";

import plugin from "./lib/plugin";

import IPFS from "./network/ipfs";
import tools from "./lib/tools";

import TPL from "./lib/tpl";
import INFT from "./lib/inft";
import VERSION from "./lib/version";

function App() {
  let [update, setUpdate] = useState(0);
  let [show, setShow] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  const QR={
    view:(anlink)=>{
      setTitle("iNFT viewer");
      setContent(<Viewer anchor={anlink}/>);
      setShow(true);
    },
    template:(cid)=>{
      setTitle("iNFT template previewer");
      //setContent("template here:"+cid);
      setContent(<Detail alink={cid} dialog={self.dialog} fresh={self.fresh}/>)
      setShow(true);
    },
    decode:(str)=>{
      if(!str || str==="#") return false;
      const pure=str.slice(1,str.length);
      const arr=pure.split("/");

      const io={
        act:"template",
        param:[],
      }
      switch (arr.length) {
        case 1:
          if(arr[0].length!==59) return false;
          io.param.push(arr[0]);
          break;

        case 2:
          io.act=arr[0];
          io.param.push(arr[1]); 
          break;

        default:

          break;
      }
      return io;
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
    checking:()=>{
      //const req=window.location.hash;
      
      const io=QR.decode(window.location.hash);
      window.location.hash="";        //clear the hash after decode
      //console.log(io);
      if(io===false) return true;
      plugin.run(io.act,io.param);
    },
    regQR:()=>{
      for(var key in QR){
        plugin.reg(key,QR[key]);
      }
      console.log(`QR function set successful.`);
      return true;
    },
    init:()=>{      //first run iNFT minter;
      const version=Local.get("version");
      if(!version){
        Local.set("prefix",`i${tools.char(10).toLocaleLowerCase()}`);
        Local.set("pointer",0);
        Local.set("version",config.version);
      }else{
        const pre_ver=parseInt(version);
        if(config.version>pre_ver){
          console.log(`Minter version updated, ready to run update`);
        }
      }
    },
    start: () => {
      //1.get target template;
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
        const def=Data.getHash("cache", tpl);
        def.cid=tpl;
        Data.set("template", def);
        self.fresh();
      }
    },
  }

  
  useEffect(() => {
    //0.init works
    TPL.auto();     //auto cache iNFT templates from IPFS;
    INFT.auto();    //auto cache iNFT list
    VERSION.auto(config.version); //

    //1.basice setting of Minter
    self.init();
    self.regQR();

    //1.checking the hash to confirm next action.
    self.checking();  //check input from hash

    //2.linke to server to fresh the iNFT result
    Chain.link(config.node[0], (API) => {
      self.start();
    });
  }, []);

  return (
    <Container className="app" id="minter">
      <Header fresh={self.fresh} dialog={self.dialog} update={update} />
      <Preview fresh={self.fresh} update={update} node={config.node[0]} />
      <Action fresh={self.fresh} dialog={self.dialog} update={update} />
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
