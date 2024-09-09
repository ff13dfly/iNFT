import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";

import { FaWindowClose } from "react-icons/fa";

/* Mini task, show the details of minting robot
*   @param  {number}    key           //list order
*   @param  {object}    data          //task detail local
*   @param  {function}  remove        //task remove function
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

  let [info, setInfo] = useState("");
  let [running, setRunning] = useState(false);    //wether the task is running

  let [template, setTemplate] = useState(props.data.gene.cid);
  let [balance, setBalance]= useState(0);                         //balance of minting account
  let [password, setPassword]= useState("");                      //minting account 

  const self = {
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    clickRun: (ev) => {
      setRunning(true);
    },
    clickStop: (ev) => {
      setRunning(false);
    },
    clickRemove: (name) => {
      if (props.remove) props.remove(name);
    },
  }

  useEffect(() => {
    console.log(props);

    //1.set balance of address
    const chain=Network(props.data.network);
    chain.balance(props.data.address,(dt)=>{
      setBalance(dt.free);
    });

  }, [props.data]);

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
                <small><strong>Task: {props.data.name}</strong>, {props.data.address}<br/>
                $INFT {balance}, prefix: {props.data.more.prefix} </small>
              </Col>
              <Col className="pt-2" md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <Form.Control
                  size="sm"
                  type="text"
                  disabled={running}
                  placeholder="Input the CID of gene template."
                  value={template} 
                  onChange={(ev) => {
                    self.changeTemplate(ev);
                  }} />
              </Col>
              <Col className="pt-2 text-end" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
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
              self.clickRemove(props.data.name);
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
              value={password} 
              onChange={(ev) => {
                self.changePassword(ev);
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