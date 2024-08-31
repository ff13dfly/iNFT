import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function ImageOrgin(props) {
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
        <img src={`${window.location.origin}/imgs/logo.png`} alt="iNFT logo"/>
      </Col>
    </Row>
  );
}
export default ImageOrgin;