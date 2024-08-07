import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* iNFT comment list
*   @param  {string}    bounty           //bounty alink
*/

function CommentSubmit(props) {
  const size = {
    row: [12],
  };

  let [avatar, setAvatar] = useState("imgs/logo.png");

  const self = {

  }

  useEffect(() => {
    
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Comment add
      </Col>
    </Row>
  );
}
export default CommentSubmit;