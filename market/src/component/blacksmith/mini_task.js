import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import TPL from "../../system/tpl";
import INFT from "../../system/inft";
import Task from "../../system/task";
import Account from "../../system/account";
import tools from "../../lib/tools";

import { FaWindowClose } from "react-icons/fa";

/* Mini task, show the details of minting robot
*   @param  {number}    key           //list order
*   @param  {object}    data          //task detail local
*   @param  {function}  remove        //task remove function
*/

let abord=false;              //abord tag
function MiniTask(props) {
  const size = {
    row: [12],
    left: [2, 10],
    title: [9, 3],
    run: [4, 6, 2],
    layout: [11, 1]
  };

  let [info, setInfo] = useState("");
  let [running, setRunning] = useState(false);                    //wether the task is running

  let [template, setTemplate] = useState(props.data.gene.cid);    //gene template CID
  let [balance, setBalance] = useState(0);                        //balance of minting account
  let [password, setPassword] = useState("");                     //minting account 
  let [offset, setOffset] = useState([]);                         //minting offset setting 


  const self = {
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    changePassword: (ev) => {
      setPassword(ev.target.value);
    },
    clickRun: (ev) => {
      //self.start(password,"333abc");
      setInfo("");
      if (!password) return setInfo("Invalid password.");
      setInfo("Ready to go.");
      setRunning(true);
      self.start(password, props.data.name);
      setPassword("");      //reset the password
    },
    clickStop: (ev) => {
      setInfo("Waiting for the last minting to finalize.");
      abord=true;
    },
    clickRemove: (name) => {
      if (props.remove) props.remove(name);
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
    updateOffset: (name, arr, ck) => {
      const narr = [];
      for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        narr.push(row.value);
      }
      return Task.update.offset(name, narr, ck);
    },
    
    start: (pass, name) => {
      return (() => {
        setTimeout(() => {
          Task.get(name, (dt) => {
            //1.check task details.
            if (dt.error) {
              setRunning(false);
              return setInfo(dt.error);
            }
            setInfo("Task confirmed.");

            //2.get sub account from local
            const addr = dt.address;
            Account.get(addr, (fs) => {
              if (fs.length !== 1) {
                setRunning(false);
                return setInfo("Invalid sub account.");
              }

              //3.check balance of account
              setInfo("Checking balance of account.");
              const chain = Network(dt.network);
              chain.balance(addr, (balance) => {
                if (balance.free < 10) {
                  setRunning(false);
                  return setInfo("Low balance of account.");
                }

                //4.decode JSON file to get pair
                setInfo("Decoding encried JSON account file.");
                chain.load(JSON.stringify(fs[0]), pass, (pair) => {
                  if (pair.error) {
                    setRunning(false);
                    return setInfo(pair.error);
                  }

                  //5.minting iNFT on chain
                  let index=parseInt(dt.more.nonce)+1;
                  const loop=(ck)=>{
                    //a.prepare the anchor data;
                    const prefix=dt.more.prefix;
                    const anchor_name=`${prefix}${index}`;
                    const raw=INFT.format.raw(dt.gene.cid,dt.offset);
                    const protocol=INFT.format.protocol();
                    const anchor={ anchor: anchor_name, raw: raw, protocol: protocol };

                    setInfo(`Minting: ${anchor_name}`);
                    chain.write(pair, anchor, (process) => {
                      if(process.error){
                        setRunning(false);
                        return setInfo(process.error);
                      }
                      setInfo(process.msg);

                      //b.operation after finalized
                      if(process.status==="Finalized"){

                        //1.update the nonce of minting
                        Task.update.nonce(name,index,(res)=>{
                          if(res.error) return setInfo(res.error);
                        });

                        //2.abord the task
                        if(abord===true){
                          setRunning(false);    //stop running
                          abord=false;           //reset flag
                          return setInfo(`Task abord.`);
                        }else{
                          index++;
                          return setTimeout(loop,300);
                        }
                      }
                    });
                  };
                  loop();
                });
              });
            });
          });
        }, 300);
      })(pass);
    },
  }

  useEffect(() => {
    console.log(props);

    //1.set balance of address
    const chain = Network(props.data.network);
    chain.balance(props.data.address, (dt) => {
      setBalance(dt.free);
    });

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
                <small><strong>Task: {props.data.name}</strong>, {props.data.address}<br />
                  $INFT {balance}, prefix: {props.data.more.prefix}, amount: {props.data.more.nonce} </small>
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


        <Row className="pt-2">
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
          <Col className="pt-1 text-end" md={size.run[1]} lg={size.run[1]} xl={size.run[1]} xxl={size.run[1]}>
            {info}
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