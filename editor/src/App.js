import { Container,Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import Board from "./component/board";
import Operation from "./component/operation";
import Basic from "./component/basic";
import Series from "./component/series";
import Template from "./component/template";
import Network from "./component/network";
import Preview from "./component/preview";
import Puzzle from "./component/puzzle";

import NFT from "./component/nft";
import Detail from "./component/detail";

import IPFS from "./lib/IPFS";

function App() {

  const size = {
    row: [12],
    side:[6,4,2],
    opt:[4,8],
  };

  let [update, setUpdate]= useState(0);

  const self={
    fresh:()=>{
      update++;
      setUpdate(update);
    },
  }
  
  useEffect(() => {
    // const cid="QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf";
    // Chain.view(cid,(dt)=>{
    //   console.log(dt);
    // });
    const solana=window.solanaWeb3;
    const transaction = new solana.Transaction();
    console.log(transaction);
  }, []);

  return (
    <div>
      <Container>
        <Network />
        <Row>
          <Col lg={size.side[0]} xl={size.side[0]} xxl={size.side[0]} >
            <Board fresh={self.fresh} update={update}/>
            <Row>
              <Col lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]} >
                <Basic fresh={self.fresh} update={update}/>
              </Col>
              <Col lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]} >
                <Operation fresh={self.fresh} update={update}/>
              </Col>
            </Row>
          </Col>
          <Col lg={size.side[1]} xl={size.side[1]} xxl={size.side[1]} >
            <NFT fresh={self.fresh} update={update}/>
            <Puzzle fresh={self.fresh} update={update}/>
            <Detail fresh={self.fresh} update={update} />
          </Col>
          <Col lg={size.side[2]} xl={size.side[2]} xxl={size.side[2]} > 
            
            <Template fresh={self.fresh} update={update}/>
            <Preview fresh={self.fresh} update={update}/>
            <Series fresh={self.fresh} update={update}/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
