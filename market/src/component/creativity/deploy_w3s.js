import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    props.hash        //unique hash
*/

function DeployW3S(props) {
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
          Deployment of web3.storage
        </Col>
      </Row>
  );
}
export default DeployW3S;