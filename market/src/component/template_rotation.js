import { Row, Col,Table } from "react-bootstrap";
import { useState,useEffect } from "react";

function TemplateRotation(props) {
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
        Template rotation parameters, raw: {JSON.stringify(props.data)}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
      <Table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>part.rotation</td>
              <td>{props.data && props.data[0]}</td>
              <td>Part rotation value.</td>
            </tr>
          </tbody>
        </Table>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

      </Col>
    </Row>
  );
}
export default TemplateRotation;