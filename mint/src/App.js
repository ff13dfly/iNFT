import { Container,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

import  Data from "./lib/data";
import  Local from "./lib/local";

// iNFT definition
// anchor://aabb/217148
let subs={};            //加载订阅的方法

function App() {

  const size = {
    row: [12],
    side:[6,3,3],
  };
  let [update, setUpdate]= useState(0);
  let [show,setShow]=useState(false);
  let [title,setTitle]=useState("");
  let [content,setContent]=useState("");

  const config={
    default:"anchor://aabb/217148",
    server:"ws://127.0.0.1:9944",
  }

  // const config={
  //   default:"anchor://aabb/777139",
  //   server:"wss://dev2.metanchor.net",
  // }

  let wsAPI=null;
  let linking=false;

  const self={
    init:(uri,ck)=>{
      if(linking) return setTimeout(()=>{
          self.link(uri,ck);
      },500);

      if(wsAPI!==null)return ck && ck(wsAPI);

      linking=true;
      const { ApiPromise, WsProvider } =window.Polkadot;
      try {
          const provider = new WsProvider(uri);
          ApiPromise.create({ provider: provider }).then((api) => {
            //console.log(`Linked to ${config.server}`);
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
                console.log(txt);
              },
          },
      };
      const easyRun = window.Easy.easyRun;
      easyRun(alink, startAPI, (res) => {
        return ck && ck(res);
      });
    },
    dialog:(ctx,title)=>{
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
    fresh:()=>{
      update++;
      setUpdate(update);
    },
    subscribe:(key,fun)=>{
      subs[key]=fun;
    },
  }

  const tpls=Local.get("template");
  if(!tpls){
    const data=[]
    data.push({
      alink:config.default,
      name:"",
      tags:[]
    })
    Local.set("template",JSON.stringify(data));
  }

  useEffect(() => {
    //1.连接服务器
    self.init(config.server,(API)=>{
      const anchorJS=window.AnchorJS;
      anchorJS.set(API);

      console.log(`Ready to read data.`);

      self.read(config.default,(res)=>{
        //console.log(res);
        const key=`${res.location[0]}_${res.location[1]}`;
        if(res.data && res.data[key]!==undefined){
          const dt=res.data[key];
          try {
            const raw=JSON.parse(dt.raw);
            Data.set("template",raw);
            self.fresh();
          } catch (error) {
            console.log(error);
          }
        }
      });

      anchorJS.subcribe((anchors,block,hash)=>{
        for(let k in subs){
          subs[k](block,hash);
        }
      });
    });
  }, []);
  
  return (
    <div>
      <Container>
        <Header fresh={self.fresh} dialog={self.dialog} update={update}/>
        <Preview fresh={self.fresh} update={update} subscribe={self.subscribe}/>
        <Action fresh={self.fresh} dialog={self.dialog} update={update}/>
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
