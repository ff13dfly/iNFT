import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Template creator basic setting
*   @param  {string}    uuid        //unique name
*/

function CreativityBasic(props) {
  const size = {
    row: [12],
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
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Template Basic</h5>
      </Col>
    </Row>
  );
}
export default CreativityBasic;