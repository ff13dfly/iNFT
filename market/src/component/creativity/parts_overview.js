import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsOverview(props) {
  const size = {
    row: [12],
    grid:[2,6,4]
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
      <Col className="parts_border" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <button className="btn btn-md btn-default">+ New Part</button>
          </Col>
          {list.map((row, index) => (
            <Col key={index} className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button className="btn btn-md btn-primary">#{index}</button>
            </Col>
          ))}
          
        </Row>
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
          Part detail.
      </Col>
      <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
          More information.
      </Col>
    </Row>
  );
}
export default PartsOverview;