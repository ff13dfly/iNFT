import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PaymentAnchor(props) {
  const size = {
    row: [12],
  };

  const self = {
    
  }

  useEffect(() => {
    console.log(props);
  }, [props.target, props.amount]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Anchor Payment
      </Col>
    </Row>
  );
}
export default PaymentAnchor;