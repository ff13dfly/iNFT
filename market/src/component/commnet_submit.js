import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* iNFT comment list
*   @param  {string}    bounty           //bounty alink
*/

function CommentSubmit(props) {
  const size = {
    row: [12],
    left: [9,3],
  };

  let [avatar, setAvatar] = useState("imgs/logo.png");

  const self = {

  }

  useEffect(() => {
    
  }, []);

  return (
    <Row>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <input type="text"  className="form-control" placeholder="Commnet of bounty" />
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-primary">Comment</button>
      </Col>
    </Row>
  );
}
export default CommentSubmit;