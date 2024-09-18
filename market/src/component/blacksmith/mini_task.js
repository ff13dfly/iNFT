import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import PriveiwINFT from "../common/inft_preview";

import Network from "../../network/router";
import TPL from "../../system/tpl";
//import INFT from "../../system/inft";
import Task from "../../system/task";
//import Account from "../../system/account";
//import Cache from "../../lib/data";
import tools from "../../lib/tools";

import { FaWindowClose, FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";

/* Mini task, show the details of minting robot
*   @param  {number}    key           //list order
*   @param  {object}    data          //task detail local
*   @param  {function}  remove        //task remove function
*/

function MiniTask(props) {
  const size = {
    row: [12],
    left: [2, 10],
    title: [8, 3, 1],
    run: [6, 4, 2],
    layout: [11, 1],
    info: [10, 2]
  };

  let [info, setInfo] = useState("");
  let [running, setRunning] = useState(true);                    //wether the task is running

  let [template, setTemplate] = useState(props.data.gene.cid);    //gene template CID
  let [balance, setBalance] = useState(0);                        //balance of minting account
  let [password, setPassword] = useState("");                     //minting account 
  let [offset, setOffset] = useState([]);                         //minting offset setting 

  let [nonce, setNonce] = useState(props.data.more.nonce);
  let [hash, setHash] = useState("0x0000000000000000000000000000000000000000000000000000000000000000");       //hash to preview iNFT

  let [more, setMore] = useState(false);   //wether show more setting

  const self = {
    changeTemplate: (ev) => {
      const cid = ev.target.value;
      setTemplate(cid);

      //1.check the cid
      if (cid.length === 59) {

        //2.check the gene
        TPL.view(cid, (dt) => {
          if (dt !== false) {
            //3.update the gene
            self.updateTemplate(props.data.name, cid, (res) => {
              if (res !== true) return setInfo("Gene updated.");
            });
          }
        });
      }
    },
    changePassword: (ev) => {
      setPassword(ev.target.value);
    },

    clickRun: (ev) => {
      setInfo("");
      if (!password) return setInfo("Invalid password.");
      setInfo("Ready to go.");
      setRunning(true);
      setPassword("");      //reset the password
      //self.start(password, props.data.name);
      Task.start(password, props.data.name, self.decoder);
    },
    clickStop: (ev) => {
      setInfo("Waiting for the last minting to finalize.");
      Task.stop(props.data.name);
    },
    clickRemove: (name) => {
      if (props.remove) props.remove(name);
    },
    clickMore: () => {
      setMore(!more);
    },
    clickOffset: (index, max) => {

      //1.update the buttons
      const val = offset[index].value === (max - 1) ? 0 : offset[index].value + 1;
      offset[index].value = val;
      const noffset = tools.clone(offset);
      setOffset(noffset);

      //2.update to local indexedDB
      self.updateOffset(props.data.name, noffset, (res) => {
        if (res !== true) return setInfo(JSON.stringify(res));
      });
    },
    getOffset: (cid, ck, current) => {
      TPL.view(cid, (data) => {
        const arr = [];
        if (data === false) return arr;
        for (let i = 0; i < data.parts.length; i++) {
          const row = data.parts[i];
          const max = row.value[2];
          if (current) {
            arr.push({
              value: current[i],
              max: max,
            });
          } else {
            arr.push({
              value: tools.rand(0, max - 1),
              max: max,
            });
          }
        }
        return ck && ck(arr);
      });
    },
    mergeOffset:(list)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        arr.push(list[i].value);
      }
      return arr;
    },
    updateOffset: (name, arr, ck) => {
      const narr = [];
      for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        narr.push(row.value);
      }
      return Task.update.offset(name, narr, ck);
    },
    updateTemplate: (name, cid, ck) => {
      return Task.update.gene(name, cid, ck);
    },
    updateNonce:(name,n,ck)=>{
      return Task.update.nonce(name, n, ck);
    },
    balance:()=>{
      const chain = Network(props.data.network);
      const div=chain.divide();
      chain.balance(props.data.address, (dt) => {
        setBalance(parseFloat(parseInt(dt.free)/div));
      });
    },
    decoder:(response)=>{
      console.log(response);

        if(response.message) setInfo(response.message);

        if(response.nonce){
          self.balance();
          setNonce(response.nonce);
        }

        if(response.hash){
          setHash(response.hash);
        }

        if(response.error){
          setInfo(response.error);
          setRunning(false);
        }

        if(response.exit){
          setRunning(false);
        }
    },
    fresh:()=>{
      //1.set balance of address
      self.balance();

      //2.calc the offset
      if (!props.data.offset || props.data.offset.length === 0) {
        //2.1. get random offset
        self.getOffset(props.data.gene.cid, (os) => {
          setOffset(os);
          //2.2.update the offset setting
          self.updateOffset(props.data.name, os, (res) => {
            if (res !== true) return setInfo(JSON.stringify(res));
          });
        });
      } else {
        self.getOffset(props.data.gene.cid, (os) => {
          setOffset(os);
        }, props.data.offset);
      }
    },
  }

  useEffect(() => {

    self.fresh();   //fresh details
                    //check running
    //console.log(props.data.name,Task.running(props.data.name));

    if(!Task.running(props.data.name)){
      setRunning(false);
    }else{
      Task.callback(props.data.name,self.decoder);
    }
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <PriveiwINFT
          id={`apply_view_${props.data.name}`}
          hash={hash}
          hidden={false}
          template={template}
          offset={self.mergeOffset(offset)}
          force={true}
          hightlight={false}
        />
      </Col>

      <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <Row>
          <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
            <Row>
              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <small>
                  Task <strong>{props.data.name}</strong>,  
                  {props.data.address}
                </small>
              </Col>
              <Col md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
                <small>
                  <strong>{balance}</strong> $ANK, 
                  prefix: <strong className="mr-5">{props.data.more.prefix}</strong>,
                  nonce: <strong>{nonce}</strong>
                </small>
              </Col>
              <Col className="text-end" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
                <button className="btn btn-sm btn-default" onClick={(ev) => {
                  self.clickMore()
                }}>
                  {!more ? <FaAngleDoubleDown /> : <FaAngleDoubleUp />}
                </button>
              </Col>
            </Row>

            <Row hidden={!more}>
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
              <Col className="pt-2" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <Form.Select size="sm" disabled={running}>
                  <option value={"account_01"}>Anchor Block Hash</option>
                  <option value={"account_02"}>Bitcoin Block Hash</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>
          <Col className="text-end" md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
            <button
              className="btn btn-sm btn-default"
              disabled={running}
              onClick={(ev) => {
                self.clickRemove(props.data.name);
              }}><FaWindowClose className={running ? "text-secondary" : "text-danger"} /></button>
          </Col>
        </Row>


        <Row hidden={!more} className="pt-2">
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <strong className="mr-10">Offset</strong>
            {offset.map((row, index) => (
              <button
                disabled={running || row.max === 1}
                key={index}
                style={{ width: "30px" }}
                className={row.max === 1 ? "btn btn-sm mr-5 btn-dark" : "btn btn-sm mr-5 btn-warning"}
                onClick={(ev) => {
                  self.clickOffset(index, row.max);
                }}
              >{row.value}</button>
            ))}
          </Col>
        </Row>

        <Row className="pt-2">
          <Col md={size.run[0]} lg={size.run[0]} xl={size.run[0]} xxl={size.run[0]}>
            {info}
          </Col>
          <Col className="pt-1 text-end" md={size.run[1]} lg={size.run[1]} xl={size.run[1]} xxl={size.run[1]}>
            
            <Form.Control
              size="sm"
              type="password"
              disabled={running}
              placeholder={`Password of ${tools.shorten(props.data.address, 5)}`}
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