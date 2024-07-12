import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import TPL from "../system/tpl";

function BountyTarget(props) {
  const size = {
    row: [12],
    half: [6],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
  };

  let [list, setList] = useState([]);

  const self = {

  }

  useEffect(() => {
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      {list.map((row, index) => (
        <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <Row>
            <Col key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >

            </Col>
          </Row>
        </Col>
      ))}
      <Col className='text-center' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <button className='btn btn-md btn-primary'>+ bounty target</button>
      </Col>
    </Row>
  );
}
export default BountyTarget;