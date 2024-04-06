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
      //console.log(tpl);
    },
  }



  useEffect(() => {
    self.start();

    //1.call the target contract
    //const appkey = "k6cgN7HWWcZwAXAuguSZu6SWTiVxPM6hsXNzjQtuFPF";
    //const napp="7N1CUpr3xe7K6bikS47FaiXXxxzSuboXZ9fiArdpTtU6";
    //const napp="2RKUqkzNWdi5o8i2ynWDxk3V4wDoLFVMbzbm4gTjtfHA";
    //const napp="Di3VKXKbLiFFDhXNJW7Ki1NLrNy7b78TAbvfceDsHDNw"
    // Chain.run(napp, { hello: "my word" }, (res) => {
    //   console.log(res);
    // }, "devnet");

    //2.get the transaction details
    // const txHash="38d2tMmwSJgQKQhEQevXW4xmFLjw5h85itK8tHUnYdtJn9K7tvPMJKA8MsLfazCLaWfauWY5vq9qCuvSg9ztid21";
    // Chain.view(txHash,"transaction",(res) => {
    //   console.log(res);
    // }, "devnet");

    // const hash="EZTgEHD3DiftqDL3FcHGcZNKwmwD7inj5YN9epBJVghv";
    // Chain.view(hash,"account",(res) => {
    //   console.log(res.data.toString());
    // }, "devnet");

    const hash="AsC5q38UmK9879eczUa1UmYoyKEjXbJwqmf1L2g4QCmi";
    Chain.view(hash,"account",(res) => {
      console.log(hash);
      console.log(res);
      console.log(res.data.toString())
    }, "devnet");

    // const program_id="83EAcYs5J9PoGUvkxyiB4axaMPRCUa6paBmov2A2L4Pm";
    // const data_id="Fw23tEb632ytFPA8XPYhKRYi2584tphexcMpsLw4hc6y";
    // const owner_id="EmEY2LbCJT5Povwo96bP88A1e6mAaADKhZ4P1xY7zHWJ";
    // Chain.test(program_id,data_id, owner_id, (res) => {
    //   console.log(res);
    // }, "devnet");

    // Chain.storage({hello:"world peace"},(obj)=>{

    // });

    // Chain.data.save({hello:"world peace"},(hash)=>{
    //   console.log(hash);
    // },"devnet");

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
