import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import API from "../../system/api";
import Account from "../../system/account";

/* iNFT comment list
*   @param  {string}    props.bounty      //bounty alink
*   @param  {number}    [props.height]    //mini height of container
*/

function CommentList(props) {
  const size = {
    row: [12],
    comment: [1, 11],
  };

  let [list, setList] = useState([]);

  const self = {
    getMinHeight:()=>{
      if(props.height) return `${props.height}px`;
      return "540px";
    },
  }

  useEffect(() => {
    API.comment.list(props.alink, (res) => {
      if(!res.success) return false;
      setList(res.data.reverse());
    });
  }, [props.update,props.alink]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Comments</h5>
      </Col>
      <Col className="pt-2 container_comment" style={{ minHeight: self.getMinHeight(),background:"#EEEEEE"}} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <Row key={index} className="pb-4">
            <Col className="" md={size.comment[0]} lg={size.comment[0]} xl={size.comment[0]} xxl={size.comment[0]}>
              <Image
                className="avatar"
                src={Account.avatar(row.address)}
                roundedCircle
                width="100%"
              />
            </Col>
            <Col className="pt-2" md={size.comment[1]} lg={size.comment[1]} xl={size.comment[1]} xxl={size.comment[1]}>
              <div className="bounty_chat">{row.memo}</div>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>

  );
}
export default CommentList;