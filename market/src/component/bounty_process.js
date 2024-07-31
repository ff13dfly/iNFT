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

  let [ anchorBounty, setAnchorBounty ] = useState("");
  let [ anchorPayment, setAnchorPayment ] = useState("");
  let [ anchorAppy, setAnchorApply ] = useState("");
  let [ anchorDistribution, setAnchorDistribution] = useState("");

  const self={
    fresh:()=>{
      API.bounty.view(props.name,(res)=>{
        if(!res.success) return false;
        setAnchorBounty(res.data.alink);
      });
    },
  }
  useEffect(() => {
    self.fresh();
  }, [props.data,props.extend]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        Bounty details ( {anchorBounty} ) 
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <hr />Payment details ( {anchorPayment} ) 
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <hr />Apply details
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <hr />Distribution details
      </Col>
    </Row>
  );
}
export default BountyProcess;