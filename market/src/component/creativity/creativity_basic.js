import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Template creator basic setting
*   @param  {string}    uuid        //unique name
*/

function CreativityBasic(props) {
  const size = {
    row: [12],
    half:[6],
  };

  let [list, setList] = useState([]);

  const self = {
    
  }

  useEffect(() => {
    const arr=[{mock:"a"},{mock:"b"}]
    setList(arr);
  }, []);

  return (
    <Row>
      <Col className="bg-secondary text-white pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Templates</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Width</small>
        <input type="number" className="form-control"/>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Height</small>
      </Col>

      <Col className="bg-secondary text-white pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Image</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Width</small>
        <input type="number" className="form-control"/>
      </Col>

      <Col className="bg-secondary text-white pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Components</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Width</small>
        <input type="number" className="form-control"/>
      </Col>

      <Col className="bg-secondary text-white pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Series</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Width</small>
        <input type="number" className="form-control"/>
      </Col>

      <Col className="bg-secondary text-white pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Deploy</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>Cell Width</small>
        <input type="number" className="form-control"/>
      </Col>
    </Row>
  );
}
export default CreativityBasic;