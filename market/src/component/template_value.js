import { Row, Col, Table } from "react-bootstrap";
import { useEffect } from "react";

function TemplateValue(props) {
  const size = {
    row: [12],
    head: [4, 8],
  };

  const self = {

  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Template value parameters, raw: {JSON.stringify(props.data)}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Table className="hover">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Definition</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>part.value[0]</td>
            <td>{props.data && props.data[0]}</td>
            <td>Start position of hash</td>
          </tr>
          <tr>
            <td>part.value[1]</td>
            <td>{props.data && props.data[1]}</td>
            <td>Step to split hash</td>
          </tr>
          <tr>
            <td>part.value[2]</td>
            <td>{props.data && props.data[2]}</td>
            <td>Amount to get result</td>
          </tr>
          <tr>
            <td>part.value[3]</td>
            <td>{props.data && props.data[3]}</td>
            <td>Offset added to the result</td>
          </tr>
          </tbody>
        </Table>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

      </Col>
    </Row>
  );
}
export default TemplateValue;