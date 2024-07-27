import { Row, Col, Breadcrumb } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Bounty from "../system/bounty";

function BountyPreview(props) {
  const size = {
    row: [12],
  };
  const self = {

  }

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Breadcrumb>
          <Breadcrumb.Item onClick={(ev) => { props.link("home") }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item onClick={(ev) => { props.link("bounty") }}>Bounty</Breadcrumb.Item>
          <Breadcrumb.Item active>anchor://{props.data.anchor}/{props.data.block}</Breadcrumb.Item>
        </Breadcrumb>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Preview of bounty here.
      </Col>
    </Row>
  );
}
export default BountyPreview;