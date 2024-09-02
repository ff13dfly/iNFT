import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function DeployCESS(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self = {
    
  }

  useEffect(() => {
    const arr=[{mock:"IPFS"},{mock:"Crust"}]
    setList(arr);
  }, []);

  return (
      <Row>
        <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Deployment of CESS Network
        </Col>
      </Row>
  );
}
export default DeployCESS;