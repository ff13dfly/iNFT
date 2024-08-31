import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsOverview(props) {
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
        Parts image selected area.
      </Col>
    </Row>
  );
}
export default PartsOverview;