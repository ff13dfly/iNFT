import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Bounty from "../system/bounty";

function UserBounty(props) {
  const size = {
    row: [12],
  };

  const self = {
  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        My bounty list
      </Col>
    </Row>
  );
}
export default UserBounty;