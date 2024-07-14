import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

import BountyTarget from './bounty_target';
import BountyTemplate from './bounty_template';

import TPL from "../system/tpl";
import RUNTIME from '../system/runtime';
import Config from '../system/config';

import tools from "../lib/tools";

function BountySubmit(props) {
  const size = {
    row: [12],
    half: [5],
    step: [2, 10],
    head: [4, 8],
    normal: [8, 4],
  };

  //submission details
  let [template, setTemplate] = useState("");
  let [title, setTitle] = useState("");
  let [desc, setDesc] = useState("");
  let [start, setStart] = useState(0);
  let [end, setEnd] = useState(0);
  let [bonus, setBonus]=useState([]);
  let [coin, setCoin]=useState("ank");            //the coin type for bounty
  
  //step enable
  let [ready, setReady] = useState(false);
  let [pay, setPay] = useState(false);
  
  //UI improvement
  let [tabs, setTabs]=useState({
    "step_1":<span><strong className='text-secondary'>Step 1 : </strong><strong>Template</strong></span>,
    "step_2":<span><strong className='text-secondary'>Step 2 : </strong><strong className='text-secondary'>Bonus</strong></span>,
    "step_3":<span><strong className='text-secondary'>Step 3 : </strong><strong className='text-secondary'>Payment</strong></span>,
  })
  let [coins,setCoins]=useState([]);

  //sub component params
  //let [series, setSeries] = useState([]);
  let [data, setData] = useState({});

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
    changeCoin:(ev)=>{
      const val=ev.target.value;
      setCoin(val.toLocaleLowerCase());
    },
    changeTabTitle:(active)=>{
      const ts={
        step_1:{index:1,title:"Template"},
        step_2:{index:2,title:"Bonus"},
        step_3:{index:2,title:"Payment"},
      }

      const ntabs={}
      for(var k in ts){
        const row=ts[k];
        if(k===active){
          ntabs[k]=<span><strong className='text-secondary'>Step {row.index} : </strong><strong className='text-warning'>{row.title}</strong></span>
        }else{
          ntabs[k]=<span><strong className='text-secondary'>Step {row.index} : </strong><strong className='text-secondary'>{row.title}</strong></span>
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
    clickSubmit:()=>{
      const addr=RUNTIME.account.get();
      const raw=self.getBountyData(addr);
      const protocol={fmt:"json",type:"data",tpl:"bounty"};
      console.log(raw,protocol);
    },
    callbackBonus:(list)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        delete row.thumb;
        delete row.name;
        arr.push(row);
      }
      setBonus(arr);
    },
    getBountyData:(addr)=>{
      return {
        title:title,
        desc:desc,
        publisher:addr,
        coin:coin,
        template:{
          cid:template,
          orgin:"web3.storage",
        },
        period:{
          start:start,
          end:end,
        },
        bonus:bonus
      }
    },
    getCoins:()=>{
      const cs=Config.get("network");
      //console.log(cs);
      const arr=[];
      for(let k in cs){
        const row=cs[k];
        if(row.support && row.support.bonus) arr.push({
          coin:row.coin,
          network:k,
        });
      }
      return arr;
   },
    fresh:()=>{
      self.changeTabTitle("step_1");
      const cs=self.getCoins();
      setCoins(cs);
    },
  }

  useEffect(() => {

    self.fresh();
  }, []);

  return (
    <Tabs
      defaultActiveKey="step_1"
      id="uncontrolled-tab-example"
      className="mb-3"
      fill
      onSelect={(active)=>{
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
            <button className='btn btn-md btn-primary' onClick={(ev) => {
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
                <select className='form-control' onChange={(ev)=>{
                  self.changeCoin(ev);
                }}>
                {coins.map((row, index) => (
                  <option value={row.coin}>{tools.toUp(row.network)}: {row.coin}</option>
                ))}
                </select>
              </Col>

              <Col className='pt-2' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                <small>Details about the bounty.</small>
                <textarea className='form-control' cols={4}></textarea>
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
                Current block number: {0}, {6}s per block.
              </Col>

              <Col className='' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyTarget data={data} callback={(dt) => {
                  self.callbackBonus(dt);
                }} />
              </Col>


              <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>

              </Col>
              <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <button className='btn btn-md btn-primary' onClick={(ev)=>{
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
                Pay the coins to target account.
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