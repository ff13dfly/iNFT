import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import tools from "../lib/tools";

/* iNFT minting list
*   @param  {string}    template           //template cid
*/

function BountyMinting(props) {
  const size = {
    row: [12],
    grid: [3],
  };


  const self = {

  }

  useEffect(() => {
    //console.log(props.template);
  }, [props.template]);

  return (
    <Row className="pt-4">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5 className="text-light">Minting</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
            <Image
              src={"imgs/logo.png"}
              rounded
              width="100%"
              style={{ border: "1px solid #EEEEEE" }}
            />
          </Col>
          <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
            <Image
              src={"imgs/logo.png"}
              rounded
              width="100%"
              style={{ border: "1px solid #EEEEEE" }}
            />
          </Col>
          <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
            <Image
              src={"imgs/logo.png"}
              rounded
              width="100%"
              style={{ border: "1px solid #EEEEEE" }}
            />
          </Col>
          <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
            <Image
              src={"imgs/logo.png"}
              rounded
              width="100%"
              style={{ border: "1px solid #EEEEEE" }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default BountyMinting;