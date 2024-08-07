import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import API from "../system/api";
import RUNTIME from "../system/runtime";

function CommentSubmit(props) {
  const size = {
    row: [12],
    left: [9,3],
  };

  let [content, setContent ]= useState("");

  const self = {
    changeContent:(ev)=>{
      setContent(ev.target.value);
    },
    clickComment:(ev)=>{
      if(!content) return false;
      const alink=props.bounty;
      const address = RUNTIME.account.get();
      API.comment.submit(address,content,alink,(res)=>{
        console.log(res);
        if(!res.success) return false;
        if(props.callback) props.callback();
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