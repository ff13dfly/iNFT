import { Container,Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

//import W3 from "w3api";

import Board from "./component/board";
import Operation from "./component/operation";
import Template from "./component/template";
import Network from "./component/network";
import Preview from "./component/preview";
import Puzzle from "./component/puzzle";
import Rarity from "./component/rarity";
import NFT from "./component/nft";
import Detail from "./component/detail";

import  Data from "./lib/data";

function App() {

  const size = {
    row: [12],
    side:[6,3,3],
  };
  // let [page, setPage] = useState("");
  // let [show, setShow] = useState(false);
  // let [title, setTitle] = useState("配置窗口");
  // let [content, setContent] = useState(true);

  let [update, setUpdate]= useState(0);
  //console.log(W3);
  //console.log(Data);

  const self={
    fresh:()=>{
      update++;
      setUpdate(update);
    },
  }
  
  return (
    <div>
      <Container>
        <Network />
        <Row>
          <Col lg={size.side[0]} xl={size.side[0]} xxl={size.side[0]} >
            <Board fresh={self.fresh} update={update}/>
            
            <Operation fresh={self.fresh} update={update}/>
          </Col>
          <Col lg={size.side[1]} xl={size.side[1]} xxl={size.side[1]} >
            <NFT fresh={self.fresh} update={update}/>
            <Puzzle fresh={self.fresh} update={update}/>
            <Detail fresh={self.fresh} update={update} />
            <Rarity fresh={self.fresh} update={update}/>
          </Col>
          <Col lg={size.side[2]} xl={size.side[2]} xxl={size.side[2]} > 
            <Template fresh={self.fresh} update={update}/>
            <Preview fresh={self.fresh} update={update}/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
