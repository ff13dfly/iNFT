import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Mint result of nearby blocks
*   @param  {string}    address        //blocks previous amount, default to 10
*/

function MintTask(props) {
  const size = {
    row: [12],
    layout: [5, 7],
    run: [9, 3],
    config: [3, 9],
    title: [5, 7],
  };

  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");
  let [running, setRunning] = useState(false);

  let [template, setTemplate] = useState("");

  const self = {
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    clickRun: (ev) => {
      setRunning(true);
    },
    clickStop: (ev) => {
      setRunning(false);
    },
  }

  useEffect(() => {
    const arr = [{ mock: "a" }, { mock: "b" }]
    setList(arr);
  }, []);

  return (
    <Row className="pt-2">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
        <Row className="pt-2">
          <Col md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
            <h5>Minting</h5>
          </Col>
          <Col className="text-end" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
            Status
          </Col>

        </Row>
      </Col>

      <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
        <Row className="pt-2">
          <Col className="pt-1" md={size.config[0]} lg={size.config[0]} xl={size.config[0]} xxl={size.config[0]}>
            <h5>Template</h5>
          </Col>
          <Col md={size.config[1]} lg={size.config[1]} xl={size.config[1]} xxl={size.config[1]}>
            <input className="form-control" type="text" value={template} onChange={(ev) => {
              self.changeTemplate(ev);
            }} />
          </Col>
        </Row>

        <Row className="pt-2">
          <Col md={size.config[0]} lg={size.config[0]} xl={size.config[0]} xxl={size.config[0]}>
            <h5>Offset</h5>
          </Col>
          <Col md={size.config[1]} lg={size.config[1]} xl={size.config[1]} xxl={size.config[1]}>
            Offset Value
          </Col>
        </Row>

        <Row>
          <Col md={size.config[0]} lg={size.config[0]} xl={size.config[0]} xxl={size.config[0]}>
            <h5>Multi Chain</h5>
          </Col>
          <Col md={size.config[1]} lg={size.config[1]} xl={size.config[1]} xxl={size.config[1]}>
            Bitcoin block selector<br/>
            Ether salt info
          </Col>
        </Row>

        <Row className="pt-2">
          <Col md={size.run[0]} lg={size.run[0]} xl={size.run[0]} xxl={size.run[0]}>
            {info}
          </Col>
          <Col className="text-end" md={size.run[1]} lg={size.run[1]} xl={size.run[1]} xxl={size.run[1]}>
            <button className="btn btn-md btn-primary" hidden={running} onClick={(ev) => {
              self.clickRun(ev);
            }}>Run</button>
            <button className="btn btn-md btn-danger" hidden={!running} onClick={(ev) => {
              self.clickStop(ev);
            }}>Stop</button>
          </Col>
        </Row>
      </Col>

    </Row>
  );
}
export default MintTask;