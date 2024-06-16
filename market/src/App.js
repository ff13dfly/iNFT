import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Header from "./component/common_header";

import Home from "./entry/home";
import Template from "./entry/template";
import Playground from "./entry/playground";
import Editor from "./entry/editor";
import Minter from "./entry/minter";
import Market from "./entry/market";
import Bounty from "./entry/bounty";
import Explorer from "./entry/explorer";

import View from "./entry/view";
import InvalidPage from "./entry/404";
import Preview from "./entry/preview";
import Detail from "./entry/detail";

function App() {
  //parameters of router
  let [content, setContent]=useState();
  let [target, setTarget]=useState("home");
  let [extend, setExtend ]=useState("");


  const pattern={
    view:["name"],
    page:["count","step"],
  }
  const self={
    decode:()=>{
      const path=window.location.pathname;
      const arr=path.substr(1).split("/");
      const single=arr.shift();
      if(!router[single]) return setContent(router["404"]);
      
      if(arr.length!==0 && pattern[single]!==undefined){
        const param={}
        for(let i=0;i<pattern[single].length;i++){
          param[pattern[single][i]]=arr[i];
        }
        console.log(`Decoding params: ${JSON.stringify(param)}`);
        if(JSON.stringify(param)!==JSON.stringify(extend))setExtend(param);
      }
      if(single!==target) setTarget(single);
    },
    linkTo:(name,param)=>{
      setExtend({});    //clean the param cache

      const folder="";
      let url=!folder?`${window.location.origin}/${name}`:`${window.location.origin}/${folder}/${name}`;
      if(param!==undefined){
        for(let i=0;i<param.length;i++){
          url+=`/${param[i]}`;
        }
      }
      window.history.replaceState({}, "", url); //update the url
      setTarget(name);    //set new router
    }
  }

  const router={
    "home":<Home extend={extend}/>,
    "detail":<Detail extend={extend}/>,
    "template":<Template extend={extend}/>,
    "market":<Market extend={extend} link={self.linkTo}/>,
    "minter":<Minter extend={extend}/>,
    "editor":<Editor extend={extend}/>,
    "playground":<Playground extend={extend}/>,
    "view":<View extend={extend} />,
    "explorer":<Explorer extend={extend}/>,
    "preview":<Preview extend={extend}/>,
    "bounty":<Bounty extend={extend}/>,
    "404":<InvalidPage />,
  }

  const alias={
    view:"market",
  }


  useEffect(() => {
    self.decode();
    setContent(router[target]);
  }, [target,extend]);

  return (
    <div>
      <Header link={self.linkTo} active={!alias[target]?target:alias[target]}/>
      <Container>{content}</Container>
    </div>
  );
}

export default App;
