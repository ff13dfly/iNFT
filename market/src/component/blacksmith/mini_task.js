import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaCheck, FaWindowClose } from "react-icons/fa";

/* Mint result of nearby blocks
*   @param  {string}    address         //blocks previous amount, default to 10
*   @param  {number}    index           //task index number
*   @param  {function}  remove          //remove function
*/

function MiniTask(props) {
  const size = {
    row: [12],
    left: [2, 10],
    title: [7, 4, 1],
    run: [6, 4, 2],
    nft: [4, 7],
    layout: [11, 1]
  };

  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");
  let [running, setRunning] = useState(false);    //wether the task is running

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
    clickRemove: (ev) => {
      console.log("Remove task.")
      if (props.remove) props.remove(props.index);
    },
  }


  useEffect(() => {
    const arr = [{ mock: "a" }, { mock: "b" }]
    setList(arr);
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <img className="view_thumb" src={`${window.location.origin}/imgs/logo.png`} alt="" />
      </Col>

      <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <Row>
          <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
            <Row>
              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <small><strong>#2</strong>, 5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw, $INFT 1.335456 </small>
              </Col>
              <Col className="pt-2" md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <Form.Control
                  size="sm"
                  type="text"
                  disabled={running}
                  placeholder="Input the CID of gene template."
                  value={template} onChange={(ev) => {
                    self.changeTemplate(ev);
                  }} />
              </Col>
              <Col className="pt-2 text-end" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <Form.Control
                  size="sm"
                  type="text"
                  disabled={running}
                  placeholder="iNFT prefix of name."
                  value={template} onChange={(ev) => {
                    self.changeTemplate(ev);
                  }} />
              </Col>
              <Col className="text-end" md={size.title[2]} lg={size.title[2]} xl={size.title[2]} xxl={size.title[2]}>

              </Col>
            </Row>
          </Col>
          <Col className="text-end" md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
            <button 
              className="btn btn-sm btn-default"
              disabled={running}
              onClick={(ev) => {
              self.clickRemove(ev);
            }}><FaWindowClose className={running?"text-secondary":"text-danger"} /></button>
          </Col>
        </Row>


        <Row className="pt-2">
          <Col md={size.nft[0]} lg={size.nft[0]} xl={size.nft[0]} xxl={size.nft[0]}>
            <Form.Select size="sm" disabled={running}>
              <option value={"account_01"}>Anchor Block Hash</option>
              <option value={"account_02"}>Bitcoin Block Hash</option>
            </Form.Select>
          </Col>
          <Col md={size.nft[1]} lg={size.nft[1]} xl={size.nft[1]} xxl={size.nft[1]}>
            <button disabled={running} className="btn btn-sm mr-5 btn-secondary">0</button>
            <button disabled={running} className="btn btn-sm mr-5 btn-secondary">0</button>
            <button disabled={running} className="btn btn-sm mr-5 btn-warning">0</button>
            <button disabled={running} className="btn btn-sm mr-5 btn-secondary">0</button>
          </Col>
        </Row>

        <Row className="pt-2">
          <Col md={size.run[0]} lg={size.run[0]} xl={size.run[0]} xxl={size.run[0]}>
            {info}
          </Col>
          <Col className="text-end" md={size.run[1]} lg={size.run[1]} xl={size.run[1]} xxl={size.run[1]}>
            <Form.Control
              size="sm"
              type="password"
              disabled={running}
              placeholder="Password to run"
              value={template} onChange={(ev) => {
                self.changeTemplate(ev);
              }} />
          </Col>
          <Col className="text-end" md={size.run[2]} lg={size.run[2]} xl={size.run[2]} xxl={size.run[2]}>
            <button className="btn btn-sm btn-primary" hidden={running} onClick={(ev) => {
              self.clickRun(ev);
            }}>Run</button>
            <button className="btn btn-sm btn-danger" hidden={!running} onClick={(ev) => {
              self.clickStop(ev);
            }}>Stop</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default MiniTask;