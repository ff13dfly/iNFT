import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function UseCharge(props) {
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
        <h6>Step1: pay USDT to get INFT</h6>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h6>Step2: cross INFT to Anchor Network</h6>
      </Col>
    </Row>
  );
}
export default UseCharge;