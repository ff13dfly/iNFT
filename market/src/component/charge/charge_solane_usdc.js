import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* USDC Charge Operation
*   @param  {string}    hash        //unique hash
*/

function ChargeSolanaUSDC(props) {
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
        Polkadot Payment ( hash / wallet )
      </Col>
    </Row>
  );
}
export default ChargeSolanaUSDC;