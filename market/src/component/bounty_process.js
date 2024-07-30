import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Bounty from "../system/bounty";
import TPL from "../system/tpl";

import API from "../system/api";

function BountyProcess(props) {
  const size = {
    row: [12],
    grid:[4,4,4],
    left:[7,5],
  };

  let [data, setData] = useState({});

  const self={
    fresh:()=>{
      API.bounty.view(props.name,(res)=>{
        console.log(res);
      });
    },
  }
  useEffect(() => {
    self.fresh();
  }, [props.data,props.extend]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        
      </Col>
      
    </Row>
  );
}
export default BountyProcess;