import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Mint result of nearby blocks
*   @param  {number}    [amount]        //blocks previous amount, default to 10
*/

function MintNearby(props) {
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
    <Row className="pt-4">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Recent iNFTs</h5>
      </Col>
      {list.map((row, index) => (
        <Col key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          {JSON.stringify(row)}
        </Col>
      ))}
    </Row>
  );
}
export default MintNearby;