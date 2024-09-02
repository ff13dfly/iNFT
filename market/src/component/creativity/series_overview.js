import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function SeriesOverview(props) {
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
          {list.map((row, index) => (
            <Col key={index} className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button className="btn btn-md btn-primary">#{index}</button>
            </Col>
          ))}
          <Col style={{marginTop:"150px"}} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <button className="btn btn-md btn-primary">+ New Series</button>
          </Col>
        </Row>
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
          Series detail.<br/>
          Part select.
      </Col>
      <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
          Series Thumb List.
      </Col>
    </Row>
  );
}
export default SeriesOverview;