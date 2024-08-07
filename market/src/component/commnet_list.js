import { Row, Col,Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import Config from "../system/config";
import RUNTIME from "../system/runtime";

/* iNFT comment list
*   @param  {string}    bounty           //bounty alink
*/

function CommentList(props) {
  const size = {
    row: [12],
    comment:[2, 10],
  };

  let [avatar, setAvatar] = useState("imgs/logo.png");

  const self = {
    getAvatar: () => {
      const cfg = Config.get(["system", "avatar"]);
      const addr = RUNTIME.account.get();
      return `${cfg.base}/${addr}.png${cfg.set}`;
    },
  }

  useEffect(() => {
    setAvatar(self.getAvatar("abc"));
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Comments</h5> 
      </Col>
      <Col className="pt-2" style={{minHeight:"540px"}} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
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
      </Col>
      
    </Row>
  );
}
export default CommentList;