import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Ads for iNFT
*   @param  {boolean}    props.show        //wether show the ads
*/

function Ads(props) {
  const size = {
    row: [12],
  };

  const self = {
    
  }

  useEffect(() => {

  }, []);

  return (
    <Row hidden={!props.show}>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        100X here!
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
    </Row>
  );
}
export default Ads;