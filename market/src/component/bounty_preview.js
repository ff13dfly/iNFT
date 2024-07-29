import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Bounty from "../system/bounty";

import API from "../system/api";

function BountyPreview(props) {
  const size = {
    row: [12],
    grid:[4,4,4],
  };
  const self = {

    getAlink:()=>{
      return `anchor://${self.getAnchor()}/${self.getBlock()}`;
    },
    getAnchor:()=>{
      if(props.data && props.data.anchor) return props.data.anchor
      if(props.extend && props.extend.anchor) return props.extend.anchor
      return "";
    },
    getBlock:()=>{
      if(props.data && props.data.block) return props.data.block
      if(props.extend && props.extend.block) return props.extend.block
      return "";
    },
  }

  useEffect(() => {
    const alink=self.getAlink();
    API.bounty.view(alink,(res)=>{
      console.log(res);
    });
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Breadcrumb>
          <Breadcrumb.Item onClick={(ev) => { props.link("home") }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item onClick={(ev) => { props.link("bounty") }}>Bounty</Breadcrumb.Item>
          <Breadcrumb.Item active>{self.getAlink()}</Breadcrumb.Item>
        </Breadcrumb>
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        Bounty list
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        Apply list
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        Commutication
      </Col>
    </Row>
  );
}
export default BountyPreview;