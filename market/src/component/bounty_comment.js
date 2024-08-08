import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

/* iNFT comment list
*   @param  {string}    bounty           //bounty alink
*/

function BountyComment(props) {
  const size = {
    row: [12],
    comment: [2, 10],
    left:[8,4],
  };

  let [avatar, setAvatar] = useState("imgs/logo.png");


  const self = {

  }

  useEffect(() => {
    //console.log(props.bounty);
  }, [props.bounty]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <h5>Comments</h5>
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-default">More</button>
      </Col>
      <Col className="pt-1" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row className="pb-4">
          <Col md={size.comment[0]} lg={size.comment[0]} xl={size.comment[0]} xxl={size.comment[0]}>
            <Image
              className="avatar"
              src={avatar}
              roundedCircle
              width="100%"
            />
          </Col>
          <Col md={size.comment[1]} lg={size.comment[1]} xl={size.comment[1]} xxl={size.comment[1]}>
            <div className="bounty_chat">It is a good one, go go go! Win 2 BTC in 2 days.Today is a good day.Today is a good day.</div>
          </Col>
        </Row>

        <Row className="pb-4">
          <Col md={size.comment[0]} lg={size.comment[0]} xl={size.comment[0]} xxl={size.comment[0]}>
            <Image
              className="avatar"
              src={avatar}
              roundedCircle
              width="100%"
            />
          </Col>
          <Col md={size.comment[1]} lg={size.comment[1]} xl={size.comment[1]} xxl={size.comment[1]}>
            <div className="bounty_chat">Today is a good day.</div>
          </Col>
        </Row>

        <Row className="pb-4">
          <Col md={size.comment[0]} lg={size.comment[0]} xl={size.comment[0]} xxl={size.comment[0]}>
            <Image
              className="avatar"
              src={avatar}
              roundedCircle
              width="100%"
            />
          </Col>
          <Col md={size.comment[1]} lg={size.comment[1]} xl={size.comment[1]} xxl={size.comment[1]}>
            <div className="bounty_chat">Today is a good day.</div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default BountyComment;