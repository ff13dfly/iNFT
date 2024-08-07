import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

/* iNFT comment list
*   @param  {string}    bounty           //bounty alink
*/

function BountyComment(props) {
  const size = {
    row: [12],
    comment:[2,10],
  };

  let [avatar, setAvatar]=useState("imgs/logo.png");

  const self = {

  }

  useEffect(() => {
    console.log(props.bounty);
  }, [props.bounty]);

  return (
    <Row className="pt-4">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5 className="text-light">Comments</h5>  
      </Col>
      <Col className="pt-1" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
        <Col md={size.comment[0]} lg={size.comment[0]} xl={size.comment[0]} xxl={size.comment[0]}>
          <Image
            className="avatar"
            src={avatar}
            roundedCircle
            width="100%"
          />
        </Col>
        <Col md={size.comment[1]} lg={size.comment[1]} xl={size.comment[1]} xxl={size.comment[1]}></Col>
        
        </Row>
      </Col>
    </Row>
  );
}
export default BountyComment;