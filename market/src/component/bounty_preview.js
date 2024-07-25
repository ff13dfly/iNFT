import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Bounty from "../system/bounty";

function BountyPreview(props) {
  const size = {
    row: [12],
  };

  const self={

  }

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Preview of bounty here.
      </Col>
    </Row>
  );
}
export default BountyPreview;