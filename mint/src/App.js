import { Container,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";

import  Data from "./lib/data";
import  Local from "./lib/local";
import  Chain from "./lib/chain";
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
  
  const self={
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
    Chain.link(config.server,(API)=>{
      Chain.read(config.default,(res)=>{
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
    });
  }, []);
  
  return (
    <div>
      <Container>
        <Header fresh={self.fresh} dialog={self.dialog} update={update}/>
        <Preview fresh={self.fresh} update={update} node={config.server}/>
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
