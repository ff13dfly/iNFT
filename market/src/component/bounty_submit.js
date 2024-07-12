import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";


function BountySubmit(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  const self = {
  }

  useEffect(() => {
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Submit your bounty
      </Col>
    </Row>
  );
}
export default BountySubmit;