import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* document for iNFT system
*   @param  {}    hash        //unique hash
*/

function DocumentINFT(props) {
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
        <h5>iNFT Document</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        What is the iNFT.
      </Col>
    </Row>
  );
}
export default DocumentINFT;