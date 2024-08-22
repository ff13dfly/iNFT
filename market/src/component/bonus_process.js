import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
function BonusProcess(props) {
  const size = {
    row: [12],
    grid:[4,4,4],
    left:[7,5],
  };

  let [data, setData] = useState({});

  const self={

  }
  useEffect(() => {

  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        
      </Col>
    </Row>
  );
}
export default BonusProcess;