import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsList(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self = {

  }

  useEffect(() => {
    const arr = [{ part: 1 }, { part: 2 }]
    setList(arr);
  }, []);


  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Select target parts to edit the orginal image.
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <button className="btn btn-sm btn-primary mr-5" key={index}> #{index}</button>
        ))}
      </Col>

    </Row>
  );
}
export default PartsList;