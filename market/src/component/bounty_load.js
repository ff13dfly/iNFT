import { Container,Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import API from "../system/api";

function BountyLoad(props) {

  const size = {
    row: [12],
    right:[8,4]
  };

  let [bounty, setBounty]=useState("");

  const self={
    changeBounty:(ev)=>{
      setBounty(ev.target.value);
    },
    clickLoad:()=>{
      API.bounty.view(bounty,(res)=>{
        console.log(res);
      });
    },
  }
  useEffect(() => {

  }, []);

  return (
      <Row className="pt-2">
        <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
          <input className="form-control" type="text" 
            placeholder="Input the bounty anchor link to load" 
            value={bounty}
            onChange={(ev)=>{
              self.changeBounty(ev);
            }}
          />
        </Col>
        <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
            <button className="btn btn-md btn-primary" onClick={(ev)=>{
              self.clickLoad();
            }}>Load Bounty</button>
        </Col>
    </Row>
  );
}
export default BountyLoad;