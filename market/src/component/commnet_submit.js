import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import API from "../system/api";

function CommentSubmit(props) {
  const size = {
    row: [12],
    left: [9,3],
  };

  let [avatar, setAvatar] = useState("imgs/logo.png");
  let [content, setContent ]= useState("");


  const self = {
    changeContent:(ev)=>{
      setContent(ev.target.value);
    },
    clickComment:(ev)=>{
      if(!content) return false;
      const alink=props.bounty;
      const address="5DLgD2J6R7QRo8CuZRnT7ZiYmwUTLz2jmhUPc1Jd44LLrd9X";
      API.comment.submit(address,content,alink,(res)=>{
        console.log(res);
      });
    },
  }

  useEffect(() => {
    console.log(JSON.stringify(props))
  }, []);

  return (
    <Row>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <input type="text"  className="form-control" placeholder="Commnet of bounty" 
          value={content} 
          onChange={(ev)=>{
            self.changeContent(ev);
          }}/>
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickComment();
        }}>Comment</button>
      </Col>
    </Row>
  );
}
export default CommentSubmit;