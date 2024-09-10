import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";

import tools from "../../lib/tools";
import Config from "../../system/config";
import RUNTIME from "../../system/runtime";

/* iNFT minting list
*   @param  {string}    bounty             //bounty_name
*   @param  {function}  callback           //ck( INPUT_DATA ),callback function
*/

function BountyMore(props) {
  const size = {
    row: [12],
    half: [5],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
  };

  //submission details
  let [title, setTitle] = useState("");           //input of bounty title
  let [desc, setDesc] = useState("");             //input of bounty desc
  let [start, setStart] = useState(0);            //input of bounty start block, when 0, start now
  let [end, setEnd] = useState(0);                //input of bounty end block, when 0, valid until bonus done
  let [coin, setCoin] = useState("ank");
  let [consignee, setConsignee] = useState("");

  let [coins, setCoins] = useState([]);
  //let [block, setBlock] = useState(0);

  let [disable, setDisable] = useState(true);

  let [more, setMore]= useState(false);

  const self = {
    changeTitle: (ev) => {
      setTitle(ev.target.value);
      self.submit("title",ev.target.value);
    },
    changeStart: (ev) => {
      setStart(parseInt(ev.target.value));
      self.submit("start",ev.target.value);
    },
    changeEnd: (ev) => {
      setEnd(parseInt(ev.target.value));
      self.submit("end",ev.target.value);
    },
    changeCoin: (ev) => {
      const val = ev.target.value;
      setCoin(val.toLocaleLowerCase());
      self.submit("coin",ev.target.value);
    },
    changeDesc: (ev) => {
      setDesc(ev.target.value);
      self.submit("desc",ev.target.value);
    },
    changeConsignee:(ev)=>{
      setConsignee(ev.target.value);
      self.submit("consignee",ev.target.value);
    },
    submit:(key,val)=>{
      const dt=self.getMoreData();
      dt[key]=val;      //get the value before status updated.
      if(props.callback) props.callback(dt);
    },
    clickMore:(ev)=>{
      setMore(!more);
    },
    getMoreData: () => {
      return {
        title: title,
        desc: desc,
        coin: coin,
        start: start,
        end: end,
        consignee:consignee,
      };
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
    load: (bt) => {
      //1.set details value
      if (bt.title) setTitle(bt.title);
      if (bt.desc) setDesc(bt.desc);
      if (bt.start) setStart(bt.start);
      if (bt.end) setEnd(bt.end);
      if (bt.coin) setCoin(bt.coin);
        
      const cs = self.getCoins();
      setCoins(cs);

      setDisable(!bt.name?false:true);
    },
  }

  useEffect(() => {
    self.load(props.bounty);
    RUNTIME.auto((addr) => {
      if(addr) setConsignee(addr);
    });
  }, [props.bounty]);

  return (
    <Row>
      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        <small>The title of bounty</small>
        <input type="text" disabled={disable} className="form-control" placeholder="Input the title of bounty"
          value={title} onChange={(ev) => {
            self.changeTitle(ev);
          }} />
      </Col>
      <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <small>Bonus coin</small>
        <select 
          className="form-control" 
          disabled={disable} 
          value={coin.toUpperCase()} 
          onChange={(ev) => {
            self.changeCoin(ev);
          }}>
          {coins.map((row, index) => (
            <option key={index} value={row.coin}>{tools.toUp(row.network)}: {row.coin}</option>
          ))}
        </select>
      </Col>

      <Col hidden={!more} className="pt-2" md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        <small>Details about the bounty.</small>
        <textarea 
          className="form-control" 
          disabled={disable}  
          cols={4} 
          placeholder="The details of the bounty." 
          value={desc} 
          onChange={(ev) => {
            self.changeDesc(ev);
          }}></textarea>
      </Col>
      <Col hidden={more} className="pt-2" md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        
      </Col>
      <Col className="text-end pt-2" md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        More setting
        <button className="btn btn-md btn-default ml-5" onClick={(ev)=>{
          self.clickMore(ev);
        }}>
          {!more?<FaAngleDoubleDown />:<FaAngleDoubleUp />}
        </button>
      </Col>

      <Col hidden={!more} className="pt-2" md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        <small>The account address to accept the bonus iNFT result.</small>
        <input 
          className="form-control" 
          type="text" 
          disabled={disable} 
          placeholder="The account to accept iNFTs." 
          value={consignee}
          onChange={(ev)=>{
            self.changeConsignee(ev);
          }}/>
      </Col>
      <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
      </Col>

      <Col hidden={!more} md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <small>Bounty start at block</small>
        <input type="number" disabled={disable} className="form-control" placeholder="Start of bounty"
          value={start} onChange={(ev) => {
            self.changeStart(ev);
          }} />
      </Col>

      <Col hidden={!more} md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <small>Bounty end at block</small>
        <input type="number" disabled={disable} className="form-control" placeholder="End of bounty"
          value={end} onChange={(ev) => {
            self.changeEnd(ev);
          }} />
      </Col>
    </Row>
  );
}
export default BountyMore;