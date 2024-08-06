import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

function TemplatePosition(props) {
  const size = {
    row: [12],
    head: [4, 8],
  };

  let [data, setDate] =useState([]);

  const self={

  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Template position parameters, raw: {JSON.stringify(props.data)}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr/>
      </Col>
    </Row>
  );
}
export default TemplatePosition;