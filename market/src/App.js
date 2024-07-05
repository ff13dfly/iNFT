import { Container} from 'react-bootstrap';
import { useEffect, useState } from "react";

import Header from "./component/common_header";
import Footer from './component/common_footer';

import Home from "./entry/home";
import Template from "./entry/template";
import Playground from "./entry/playground";
import Editor from "./entry/editor";
import Minter from "./entry/minter";
import Market from "./entry/market";
import Bounty from "./entry/bounty";
import Explorer from "./entry/explorer";
import Setting from './entry/setting';
import User from './entry/user';

import View from "./entry/view";
import InvalidPage from "./entry/404";
import Preview from "./entry/preview";
import Detail from './entry/detail';

function App() {
  //parameters of router
  let [content, setContent]=useState();
  let [target, setTarget]=useState("home");
  let [extend, setExtend ]=useState("");


  const pattern={
    view:["name"],
    page:["count","step"],
    preview:["name"],
    playground:["template"],
    detail:["name"],
    setting:["mod"],
    user:["mod"],
  }
  const self={
    checkding:()=>{
      const path=window.location.pathname;
      const arr=path.substr(1).split("/");
      const single=arr.shift();
      if(!single) return true;      //no route, return immediately

      if(!router[single]) return  setTarget("404");     //404 check

      if(arr.length!==0 && pattern[single]!==undefined){
        const param={}
        for(let i=0;i<pattern[single].length;i++){
          param[pattern[single][i]]=arr[i];
        }
        //console.log(`Decoding params: ${JSON.stringify(param)}`);
        if(JSON.stringify(param)!==JSON.stringify(extend)) setExtend(param);
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

  //all routers here
  const router={
    "home":<Home extend={extend}/>,
    "template":<Template extend={extend} link={self.linkTo}/>,
    "market":<Market extend={extend} link={self.linkTo}/>,
    "minter":<Minter extend={extend}/>,
    "editor":<Editor extend={extend}/>,
    "playground":<Playground extend={extend} link={self.linkTo}/>,
    "view":<View extend={extend} link={self.linkTo}/>,
    "detail":<Detail extend={extend} link={self.linkTo}/>,
    "explorer":<Explorer extend={extend}/>,
    "preview":<Preview extend={extend} link={self.linkTo}/>,
    "bounty":<Bounty extend={extend}/>,
    "setting":<Setting extend={extend} link={self.linkTo}/>,
    "user":<User extend={extend} link={self.linkTo}/>,
    "404":<InvalidPage />,
  }

  //use to active the target nav bar
  const alias={
    view:"market",
    preview:"template",
    detail:"explorer",
  }


  useEffect(() => {
    self.checkding();
    setContent(router[target]);
  }, [target,extend]);

  return (
    <div>
      <Header link={self.linkTo} active={!alias[target]?target:alias[target]}/>
      <Container>{content}</Container>
      <Footer link={self.linkTo} />
    </div>
  );
}

export default App;
