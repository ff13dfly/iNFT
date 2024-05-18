import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/preview";
import Action from "./component/action";
import Header from "./component/header";

import Local from "./lib/local";
import Network from "./network/router";
import config from "./config";

import plugin from "./lib/plugin";
import QR from "./lib/QR";
import tools from "./lib/tools";

import TPL from "./lib/tpl";
import INFT from "./lib/inft";
import VERSION from "./lib/version";

import Sui from "./network/sui";

function App() {
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
      //if (force) return self.start();
      update++;
      setUpdate(update);
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
    checking: () => {
      const io = self.decode(window.location.hash);
      if (io === false) return true;

      //window.location.hash = "";        //clear the hash after decode
      plugin.run(io.act, io.param);
    },
    regQR: () => {
      for (var key in QR) {
        plugin.reg(key, QR[key]);
      }
      
      const UI={dialog:self.dialog,toast:null,fresh:self.fresh}
      plugin.setUI(UI);
      //console.log(`QR function set successful.`);
      return true;
    },
    init: () => {      //first run iNFT minter;
      const version = Local.get("version");
      if (!version) {
        Local.set("prefix", `i${tools.char(10).toLocaleLowerCase()}`);
        Local.set("pointer", 0);
        Local.set("version", config.version);
      } else {
        const pre_ver = parseInt(version);
        if (config.version > pre_ver) {
          console.log(`Minter version updated, ready to run update`);
        }
      }
    },
  }


  useEffect(() => {
    //0.version checking
    VERSION.auto(config.version);   //run version update

    //1.cache iNFT templates
    const detail=INFT.mint.detail();
    if(!detail){
      TPL.setAgent(config.proxy);
    }else{
      TPL.setAgent(detail.proxy);
    }

    const only_first=true;
    TPL.auto(() => {
      self.fresh();
    },only_first);

    //2.auto cache iNFT list
    INFT.auto();

    //3.input from hash support
    self.regQR();     //reg IO method to decode input hash
    self.checking();  //check input from hash

    //4.linke to server to subscribe block finalization
    Network("tanssi").init((API) => {

    });

    //Sui.test();   //Sui network test.
  }, []);

  return (
    <Container className="app" id="minter">
      <Header fresh={self.fresh} dialog={self.dialog} update={update} />
      <Preview fresh={self.fresh} update={update} node={config.node[0]} />
      <Action fresh={self.fresh} dialog={self.dialog} update={update} />
      <Modal dialogClassName="modal-minter"
        show={show}
        size="lg"
        backdrop="static"
        onHide={(ev) => {
          setShow(false);
        }}
        centered={false}
      >
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
