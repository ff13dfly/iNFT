import { Container,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/preview";
import Action from "./component/common/action";
import Header from "./component/common/header";

import Network from "./network/router";
import config from "./config";

import plugin from "./lib/plugin";
import QR from "./lib/QR";

import TPL from "./system/tpl";
import INFT from "./system/inft";
import VERSION from "./lib/version";
import Data from "./lib/data";

let callback=null;
function App() {
  let [update, setUpdate] = useState(0);
  let [show, setShow] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  // let [grid, setGrid] = useState("");      //panel grid
  // let [hide, setHide] = useState(true);     //wether show panel
  const self = {
    dialog:{
      show:(ctx, title) => {
        setTitle(title);
        setContent(ctx);
        setShow(true);
      },
      close:()=>{
        setTitle("");
        setContent("");
        setShow(false);
      },
    },
    fresh: (force) => {
      update++;
      setUpdate(update);
    },
    //dropped, use menu when more functions.
    // panel: {
    //   show: (ctx) => {
    //     setGrid(ctx);
    //     setHide(false);
    //   },
    //   hide: () => {
    //     setGrid("");
    //     setHide(true);
    //   },
    //   callback:(fun)=>{
    //     callback=fun;
    //   },
    // },
    decode: (str) => {
      if (!str || str === "#") return false;
      const pure = str.slice(1, str.length);
      const arr = pure.split("/");

      const io = {
        act: "template",
        param: [],
      }
      switch (arr.length) {
        case 1:
          if (arr[0].length !== 59) return false;
          io.param.push(arr[0]);
          break;

        case 2:
          io.act = arr[0];
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
      //console.log(io);
      plugin.run(io.act, io.param);
    },
    regQR: () => {
      for (var key in QR) {
        plugin.reg(key, QR[key]);
      }

      const UI = { dialog: self.dialog, toast: null, fresh: self.fresh }
      plugin.setUI(UI);
      return true;
    },
    autosetNetwork: (ck) => {
      const ns = Network();
      const arr = [];
      for (var key in ns) {
        if (ns[key] !== null) arr.push(key);
      }

      Network(config.network).setNode(config.node[0]);    //set the active node for app

      Data.setHash("cache", "network", config.network);
      Data.setHash("cache", "support", arr);

      return ck && ck();
    },
  }


  useEffect(() => {
    //0.version checking
    VERSION.auto(config.version);   //run version update

    //1.cache iNFT templates
    const detail = INFT.mint.detail();
    if (!detail) {
      TPL.setAgent(config.proxy);
    } else {
      TPL.setAgent(detail.proxy);
    }

    const only_first = true;
    TPL.auto(() => {
      self.fresh();
    }, only_first);

    //2.auto cache iNFT list
    INFT.auto();

    //3.input from hash support
    self.regQR();     //reg IO method to decode input hash
    self.checking();  //check input from hash

    //4.linke to server to subscribe block finalization
    self.autosetNetwork(() => {
      const cur = Data.getHash("cache", "network");
      //console.log(cur);
      Network(cur).init((API) => {

      });
    });

    //Tanssi.test();   //Tanssi network test.
  }, []);

  return (
    <Container className="app" id="minter">
      <Header fresh={self.fresh} dialog={self.dialog} update={update} panel={self.panel} />
      <Preview fresh={self.fresh} dialog={self.dialog}  update={update} node={config.node[0]}  />
      <Action fresh={self.fresh} dialog={self.dialog} update={update} />
      {/* <Modal dialogClassName="modal-minter"
        show={!hide}
        size="lg"
        backdrop="static"
        onHide={(ev) => {
          setHide(true);
        }}
        centered={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Functions Panel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {grid}
        </Modal.Body>
      </Modal> */}

      <Modal dialogClassName="modal-minter"
        show={show}
        size="lg"
        backdrop="static"
        onHide={(ev) => {
          if(callback!==null){    //Dialog callback when close
            callback();
            callback=null;    //reset callback
          } 
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
