import { Row, Col, Table } from "react-bootstrap";
import { useState, useEffect } from "react";

function TemplateImage(props) {
  const size = {
    row: [12],
    head: [4, 8],
  };

  let [data, setDate] = useState([]);

  const self = {

  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Template image parameters, raw: {JSON.stringify(props.data)}
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
              <td>part.img[0]</td>
              <td>{props.data && props.data[0]}</td>
              <td>Image row to select from</td>
            </tr>
            <tr>
              <td>part.img[1]</td>
              <td>{props.data && props.data[1]}</td>
              <td>Image line to select from</td>
            </tr>
            <tr>
              <td>part.img[2]</td>
              <td>{props.data && props.data[2]}</td>
              <td>Image cell X extend amount</td>
            </tr>
            <tr>
              <td>part.img[3]</td>
              <td>{props.data && props.data[3]}</td>
              <td>Image cell Y extend amount</td>
            </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

      </Col>
    </Row>
  );
}
export default TemplateImage;