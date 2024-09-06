import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaCheck,FaWindowClose } from "react-icons/fa";

/* Mint result of nearby blocks
*   @param  {string}    address         //blocks previous amount, default to 10
*   @param  {number}    index           //task index number
*   @param  {function}  remove          //remove function
*/

function MintTask(props) {
  const size = {
    row: [12],
    half:[6],
    layout: [7,5],
    run: [9, 3],
    config: [3, 9],
    title: [5, 7],
    left:[7,5],
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
    clickRemove:(ev)=>{
      if(props.remove) props.remove(props.index);
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
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <h6>Task setting ( ACCOUNT_ADDRESS )</h6>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <input
              className="form-control"
              placeholder="Input the CID of gene template."
              type="text"
              value={template}
              onChange={(ev) => {
                self.changeTemplate(ev);
              }} />
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Offset to mint</small>
            <Row>
              <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
                <button className="btn btn-md mr-5 btn-secondary">0</button>
                <button className="btn btn-md mr-5 btn-secondary">0</button>
                <button className="btn btn-md mr-5 btn-warning">0</button>
                <button className="btn btn-md mr-5 btn-secondary">0</button>
              </Col>
              <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
              <button className={"btn btn-sm btn-primary"} onClick={(ev) => {
              
              }}><FaCheck size={14}/></button>
              <span className="ml-10">Ramdon</span> 
              </Col>
            </Row>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Select block hash to mint iNFT</small>
            <select className="form-control">
              <option value={"account_01"}>Anchor Block Hash</option>
              <option value={"account_02"}>Bitcoin Block Hash</option>
            </select>
          </Col>
        </Row>
      </Col>

      <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
        <Row className="pt-2">
          <Col md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
            <h6>Processing</h6>
          </Col>
          <Col className="text-end" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
              <button className="btn btn-sm btn-default" onClick={(ev) => {
                  self.clickRemove(ev);
              }}><FaWindowClose className="text-danger" /></button>
          </Col>
          <Col className="pt-2" md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
              <img className="view_thumb" src={`${window.location.origin}/imgs/logo.png`} alt="" />
          </Col>
          <Col className="pt-2" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
              <p>Starting, on </p>
          </Col>
          <Col className="" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col md={size.run[0]} lg={size.run[0]} xl={size.run[0]} xxl={size.run[0]}>
                <input type="password" className="form-control" placeholder="Password to run" />
              </Col>
              {/* <Col md={size.run[0]} lg={size.run[0]} xl={size.run[0]} xxl={size.run[0]}>
                {info}
              </Col> */}
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
      </Col>
    </Row>
  );
}
export default MintTask;