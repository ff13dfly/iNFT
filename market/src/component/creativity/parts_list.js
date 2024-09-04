import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsList(props) {
  const size = {
    row: [12],
    amount: [3, 6, 3],
    half: [6],
  };

  let [list, setList] = useState([]);
  let [amount, setAmount] = useState(8);
  let [ex, setEX] = useState(0);
  let [ey, setEY] = useState(0);
  let [offset, setOffset] = useState(0);

  const self = {
    changeAmount: (ev) => {
      setAmount(ev.target.value);
    },
    changeEX: (ev) => {
      setEX(ev.target.value);
    },
    changeEY: (ev) => {
      setEY(ev.target.value);
    },
    changeOffset: (ev) => {
      setOffset(ev.target.value);
    },
  }

  useEffect(() => {
    const arr = [{ part: 1 }, { part: 2 }]
    setList(arr);
  }, []);


  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <button className="btn btn-sm btn-primary mr-5" key={index}> #{index}</button>
        ))}
      </Col>
      <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Start Line</small>
            <input type="number" className="form-control" value={ex} onChange={(ev) => {
              self.changeEX(ev);
            }} />
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Start Row</small>
            <input type="number" className="form-control" value={ey} onChange={(ev) => {
              self.changeEY(ev);
            }} />
          </Col>
        </Row>
      </Col>
      <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            SVG overview
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Part Options</small>
          </Col>
          <Col className="text-center" md={size.amount[0]} lg={size.amount[0]} xl={size.amount[0]} xxl={size.amount[0]}>
            <button className="btn btn-sm btn-default">-</button>
          </Col>
          <Col className="text-center" md={size.amount[1]} lg={size.amount[1]} xl={size.amount[1]} xxl={size.amount[1]}>
            <input type="number" className="form-control text-center" value={amount} onChange={(ev) => {
              self.changeAmount(ev);
            }} />
          </Col>
          <Col className="text-center" md={size.amount[2]} lg={size.amount[2]} xl={size.amount[2]} xxl={size.amount[2]}>
            <button className="btn btn-sm btn-default">+</button>
          </Col>
        </Row>

        <Row>
          <Col className="pt-4" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Part X Extend</small>
            <input type="number" className="form-control" value={ex} onChange={(ev) => {
              self.changeEX(ev);
            }} />
          </Col>
          <Col className="pt-4" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Part Y Extend</small>
            <input type="number" className="form-control" value={ey} onChange={(ev) => {
              self.changeEY(ev);
            }} />
          </Col>
        </Row>

        <Row>
          <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Offset</small>
            <input type="number" className="form-control" value={offset} onChange={(ev) => {
              self.changeOffset(ev);
            }} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default PartsList;