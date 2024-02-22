import { Container,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

// iNFT definition
// anchor://aabb/217148

function App() {

  const size = {
    row: [12],
    side:[6,3,3],
  };

  let [show,setShow]=useState(false);
  let [title,setTitle]=useState("");
  let [content,setContent]=useState("");

  const config={
    default:"anchor://aabb/217148",
    //default:"anchor://aabb",
    server:"ws://127.0.0.1:9944",
  }

  let wsAPI=null;
  let linking=false;

  const self={
    init:(uri,ck)=>{
      //console.log(uri);
      if(linking) return setTimeout(()=>{
          self.link(uri,ck);
      },500);

      if(wsAPI!==null)return ck && ck(wsAPI);

      linking=true;
      const { ApiPromise, WsProvider } =window.Polkadot;
      //console.log(window.Polkadot);
      try {
          const provider = new WsProvider(uri);
          ApiPromise.create({ provider: provider }).then((api) => {
            wsAPI=api;
            linking=false;
            return ck && ck(wsAPI);
          });
      } catch (error) {
          console.log(error);
          linking=false;
          return ck && ck(error);
      }
    },
    dialog:(ctx,title)=>{
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
    fresh:()=>{

    },
    read:(alink,ck)=>{
      const anchorJS=window.AnchorJS;
      const startAPI = {
          common: {
              "latest": anchorJS.latest,
              "target": anchorJS.target,
              "history": anchorJS.history,
              "owner": anchorJS.owner,
              "subcribe": anchorJS.subcribe,
              "multi":anchorJS.multi,
              "block": anchorJS.block,
          },
          agent:{
              "process":(txt)=>{
                  self.step(txt);
              },
          },
      };
      console.log(window.Easy);
      const easyRun = window.Easy.easyRun;
      //const alink=config.default;
      easyRun(alink, startAPI, (res) => {
        console.log(res);
        return ck && ck(res);
      });
    },
  }

  useEffect(() => {
    self.init(config.server,(API)=>{
      const anchorJS=window.AnchorJS;
      anchorJS.set(API);

      self.read(config.default,(res)=>{
        console.log(res);
      })
    });
  }, []);
  
  return (
    <div>
      <Container>
        <Header fresh={self.fresh} dialog={self.dialog}/>
        <Preview fresh={self.fresh}/>
        <Action fresh={self.fresh}/>
      </Container>

      <Modal show={show} size="lg"
        onHide={(ev) => { setShow(false); }}
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
