import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function ImageGrid(props) {
  const size = {
    row: [12],
    grid: [2, 4],
  };

  let [line, setLine] = useState(8);
  let [row, setRow] = useState(4);
  const self = {
    changeLine: (ev) => {
      setLine(ev.target.value);
    },
    changeRow: (ev) => {
      setRow(ev.target.value);
    },
  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col className="pt-1" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        Line
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <Form.Control size="sm" type="number" name="line" placeholder="Image Line" value={line} onChange={(ev) => {
          self.changeLine(ev);
        }} />
        {/* <input type="number" className="form-control" value={line} onChange={(ev) => {
          self.changeLine(ev);
        }} /> */}
      </Col>

      <Col className="pt-1" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        Row
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <Form.Control size="sm" type="number" name="row" placeholder="Image Row" value={row} onChange={(ev) => {
          self.changeRow(ev);
        }} />
        {/* <input type="number" className="form-control" value={row} onChange={(ev) => {
          self.changeRow(ev);
        }} /> */}
      </Col>
    </Row>
  );
}
export default ImageGrid;