import { Container, Modal,Row,Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

import Data from "./lib/data";
import Local from "./lib/local";
import Chain from "./network/solana";
import config from "./default";
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
      let n = 9;
      const tt = setInterval(() => {
        if (n <= 0) return clearInterval(tt);
        n--;
      }, 1000);
    },
    getImageBase64:(img)=>{
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set the canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get the base64-encoded data URL
      const base64 = canvas.toDataURL('image/png');
      
      return base64;
    },
    start: () => {
      const tpl = self.getTemplate();
      console.log(tpl);
    },
  }

  useEffect(() => {
    self.start();

    // const appkey="k6cgN7HWWcZwAXAuguSZu6SWTiVxPM6hsXNzjQtuFPF";
    // const auth="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
    
    // Chain.view(auth,"account",(res)=>{
    //   console.log(res);
    // },"devnet");


    // const trans="5B3BqVPm7Hr7UVvuM3GrHyxtmU75bNAvgoWMFvRJospMkeR5G9fMF6ugGhwpwmUb1MzL2PKTwG6FRLAs7hTB9qPq";
    // Chain.view(trans,"transaction",(res)=>{
    //   console.log(res);
    // },"devnet");

    const appkey="k6cgN7HWWcZwAXAuguSZu6SWTiVxPM6hsXNzjQtuFPF";
    const owner="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
    Chain.run(appkey,owner,{hello:"word"},(res)=>{
      console.log(res);
    },"devnet");
  }, []);

  return (
    <div>
      <Container>
        <Header fresh={self.fresh} dialog={self.dialog} update={update} />
        <Preview fresh={self.fresh} update={update} node={config.node[0]} />
        
        <Action fresh={self.fresh} dialog={self.dialog} update={update} countdown={self.countdown} />
      </Container>
      <Modal show={show} size="lg" onHide={
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
    </div>
  );
}

export default App;
