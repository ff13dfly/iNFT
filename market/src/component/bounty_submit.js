import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useEffect, useState,useRef } from "react";

import BountyTarget from './bounty_target';
import BountyTemplate from './bounty_template';
import BountyDetail from './bounty_detail';

import Network from '../network/router';

import TPL from "../system/tpl";
import RUNTIME from '../system/runtime';
import Config from '../system/config';
import Bounty from '../system/bounty';
import API from '../system/api';

import tools from "../lib/tools";

function BountySubmit(props) {
  const size = {
    row: [12],
    half: [5],
    step: [2, 10],
    head: [4, 8],
    normal: [8, 4],
  };

  const loadRef = useRef(null);

  //submission details
  let [template, setTemplate] = useState("");
  let [title, setTitle] = useState("");
  let [desc, setDesc] = useState("");
  let [start, setStart] = useState(0);
  let [end, setEnd] = useState(0);
  let [bonus, setBonus] = useState([]);
  let [coin, setCoin] = useState("ank");            //the coin type for bounty

  //step enable
  let [ready, setReady] = useState(false);
  let [pay, setPay] = useState(false);

  //UI improvement
  let [tabs, setTabs] = useState({
    "step_1": <span><strong className='text-secondary'>Step 1 : </strong><strong>Template</strong></span>,
    "step_2": <span><strong className='text-secondary'>Step 2 : </strong><strong className='text-secondary'>Bonus</strong></span>,
    "step_3": <span><strong className='text-secondary'>Step 3 : </strong><strong className='text-secondary'>Payment</strong></span>,
  })
  let [coins, setCoins] = useState([]);
  let [block, setBlock] = useState(0);

  //sub component params
  //let [series, setSeries] = useState([]);
  let [data, setData] = useState({});
  let [anchor, setAnchor] = useState("");

  const self = {
    changeTitle: (ev) => {
      setTitle(ev.target.value);
    },
    changeStart: (ev) => {
      setStart(parseInt(ev.target.value));
    },
    changeEnd: (ev) => {
      setEnd(parseInt(ev.target.value));
    },
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    changeCoin: (ev) => {
      const val = ev.target.value;
      setCoin(val.toLocaleLowerCase());
    },
    changeDesc: (ev) => {
      setDesc(ev.target.value);
    },
    changeTabTitle: (active) => {
      const ts = {
        step_1: { index: 1, title: "Template" },
        step_2: { index: 2, title: "Bonus" },
        step_3: { index: 2, title: "Payment" },
      }

      const ntabs = {}
      for (var k in ts) {
        const row = ts[k];
        if (k === active) {
          ntabs[k] = <span><strong className='text-secondary'>Step {row.index} : </strong><strong className='text-warning'>{row.title}</strong></span>
        } else {
          ntabs[k] = <span><strong className='text-secondary'>Step {row.index} : </strong><strong className='text-secondary'>{row.title}</strong></span>
        }
      }
      setTabs(ntabs);
    },
    clickLoad: (ev) => {
      TPL.view(template, (dt) => {
        setData(dt);
        setReady(true);
      });
    },
    clickSubmit: () => {
      const addr = RUNTIME.account.get();
      const name = self.getBountyName(8);

      //1.storage the bounty details to indexDB
      const bt = self.getLocalData(name,addr);
      Bounty.insert(bt, (res) => {

          //2.write the bounty data to Anchor Network
          const raw = self.getBountyData(addr);
          const protocol = { fmt: "json", type: "data", tpl: "bounty" };
          const dapp = Config.get(["system", "name"]);
          const obj = {
            anchor: name,
            raw: raw,
            protocol: protocol,
            dapp: dapp,
          }
          Network("anchor").sign(obj,(res)=>{
            console.log(res);
            
            if(res.status==="Finalized"){
              //3.update local indexedDB status;

              //4.report to iNFT proxy system
              const report={
                name:name,
                transaction:res.hash,
              }
              API.bounty.submit(report,(dt)=>{
                console.log(dt);
                //5.update local indexedDB status;
              });
            }
          },"subwallet");
          

      });
    },
    callbackBonus: (list) => {
      const arr = [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        delete row.thumb;
        delete row.name;
        arr.push(row);
      }
      setBonus(arr);
    },

    getBountyName: (n) => {
      return `bounty_${tools.char(n)}`;
    },
    getLocalData:(name,addr)=>{
      return {
        name: name,
        title: title,
        desc: desc,
        publish:{
          network:"anchor",
          address:addr, 
          block:0,              //anchor block
          hash:"",              //setAnchor transaction hash
        },
        payer: {
          address:"",
          transaction:"",     //transation hash
          receiver:"",
        },
        template:{
          cid:template,
          orgin:"web3.storage",
        },
        bonus: bonus,
        start: start,
        end: end,
        coin: coin,
        status: 1, 
        stamp:tools.stamp(),    
      }
    },
    getBountyData: (addr) => {
      return {
        title: title,
        desc: desc,
        publisher: addr,
        coin: coin,
        template: {
          cid: template,
          orgin: "web3.storage",
        },
        contract:{      //contract to call for the bounty. if no, free to mint
          network:"",
          address:"",
        },
        period: {
          start: start,
          end: end,
        },
        bonus: bonus
      }
    },
    getCoins: () => {
      const cs = Config.get("network");
      //console.log(cs);
      const arr = [];
      for (let k in cs) {
        const row = cs[k];
        if (row.support && row.support.bonus) arr.push({
          coin: row.coin,
          network: k,
        });
      }
      return arr;
    },
    fresh: (ignore) => {
      self.changeTabTitle("step_1");
      const cs = self.getCoins();
      setCoins(cs);

      Network("anchor").subscribe("bounty_submit", (bk, hash) => {
        setBlock(bk);
        if(!ignore){
          setStart(bk + 10000);
          setEnd(bk + 30000);
        }
      });
    },

    load:(bounty)=>{
      //1.set template value
      setTemplate(bounty.template.cid);
      setTimeout(()=>{
        loadRef.current.click();
      },200);

      //2.set details value
      console.log(bounty);
      //setTitle(bounty.title);
      if(bounty.title) setTitle(bounty.title);
      if(bounty.desc) setDesc(bounty.desc);
      if(bounty.start) setStart(bounty.start);
      if(bounty.end) setEnd(bounty.end);
      if(bounty.coin){
        setCoin(bounty.coin);
        const cs = self.getCoins();
        //console.log(cs);
        setCoins(cs);
      } 
      if(bounty.bonus) setBonus(bounty.bonus);
    },
  }

  useEffect(() => {
    //console.log(`Ready to check bounty on progress.`);
    
    if(props.name){
      self.fresh(true);
      Bounty.get(props.name,(res)=>{
        if(!res || res.length===0) return false;
        const bty=res[0];
        self.load(bty);
        
      });
    }else{
      self.fresh();
    }
  }, [props.name]);

  return (
    <Tabs
      defaultActiveKey="step_1"
      id="uncontrolled-tab-example"
      className="mb-3"
      fill
      onSelect={(active) => {
        self.changeTabTitle(active);
      }}
    >
      <Tab eventKey="step_1" title={tabs.step_1}>
        <Row>
          <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Select a template for bounty which is storage on IPFS.
          </Col>

          <Col className='pt-2' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
            <input type="text" className='form-control' placeholder='Input template CID'
              value={template} onChange={(ev) => {
                self.changeTemplate(ev);
              }} />
          </Col>
          <Col className='pt-2 text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
            <button className='btn btn-md btn-primary' ref={loadRef} onClick={(ev) => {
              self.clickLoad(ev);
            }}>Load</button>
          </Col>
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyTemplate data={data} />
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_2" title={tabs.step_2}>
        <Row>
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Setup the details about the bounty and write on chain.
              </Col>

              <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                <small>The title of bounty</small>
                <input type="text" className='form-control' placeholder='Input the title of bounty'
                  value={title} onChange={(ev) => {
                    self.changeTitle(ev);
                  }} />
              </Col>
              <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <small>Bonus coin</small>
                <select className='form-control' value={coin.toUpperCase()} onChange={(ev) => {
                  self.changeCoin(ev);
                }}>
                  {coins.map((row, index) => (
                    <option key={index} value={row.coin}>{tools.toUp(row.network)}: {row.coin}</option>
                  ))}
                </select>
              </Col>

              <Col className='pt-2' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                <small>Details about the bounty.</small>
                <textarea className='form-control' cols={4} placeholder='The details of the bounty.' value={desc} onChange={(ev) => {
                  self.changeDesc(ev);
                }}></textarea>
              </Col>
              <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
              </Col>


              <Col md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
                <small>Bounty start at block</small>
                <input type="number" className='form-control' placeholder='Start of bounty'
                  value={start} onChange={(ev) => {
                    self.changeStart(ev);
                  }} />
              </Col>

              <Col md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
                <small>Bounty end at block</small>
                <input type="number" className='form-control' placeholder='End of bounty'
                  value={end} onChange={(ev) => {
                    self.changeEnd(ev);
                  }} />
              </Col>

              <Col className='' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Current block number: {block.toLocaleString()}, {6}s per block.
              </Col>

              <Col className='' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyTarget data={data} bonus={bonus} callback={(dt) => {
                  self.callbackBonus(dt);
                }} />
              </Col>


              <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>

              </Col>
              <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <button className='btn btn-md btn-primary' onClick={(ev) => {
                  self.clickSubmit();
                }}>Submit</button>
              </Col>

              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
              </Col>
            </Row>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_3" title={tabs.step_3}>
        <Row>
          <Col hidden={pay} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Payment details.
              </Col>
              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyDetail data={anchor} callback={() => {

                }} />
              </Col>
              <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>

              </Col>
              <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <button className='btn btn-md btn-primary'>Pay</button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  );
}
export default BountySubmit;