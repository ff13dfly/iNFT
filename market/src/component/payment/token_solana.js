import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function TokenSolana(props) {
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

      </Col>
      {list.map((row, index) => (
        <Col key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          {JSON.stringify(row)}
        </Col>
      ))}
    </Row>
  );
}
export default TokenSolana;