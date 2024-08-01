import { Row, Col } from 'react-bootstrap';

import { useEffect, useState } from "react";

import AccountSelector from './account_selector';

import Network from "../network/router";
import Account from "../system/account";
import Config from "../system/config";

import { FaCheck } from "react-icons/fa";

/* iNFT render component parameters
*   @param  {string}    title           //button title
*   @param  {string}    network         //network to filter account
*   @param  {function}  [callback]      //callback function 
*/

function BountyPay(props) {
  const size = {
    row: [12],
    transaction: [1,9,2],
  };

  let [payed, setPayed] = useState(true);    //wether transfer and got hash
  let [info, setInfo] = useState("");

  //payment details from anchor raw data
  let [network, setNetwork] = useState("");   //network of payment 
  let [amount, setAmount]= useState(0);       //amount of payment
  let [target, setTarget]= useState("");      //receiver address of payment

  let [title, setTitle]=useState(props.title);
  let [hash,setHash]= useState("");         //transaction hash to confirm payment;
  let [ready, setReady] = useState(false);

  const self = {
    changeHash:(ev)=>{
      setHash(ev.target.value);
    },
    clickPayed:()=>{
      setPayed(!payed);
      if(!payed){
        setTitle(props.title);
      }else{
        setTitle("Update");
      }
    },
    clickSign:(ev)=>{
      setInfo("");
      if(!payed){
        const chain=Network(network);
        if(!chain) return props.callback && props.callback({error:`Network ${network} is not support yet.`})
      }else{
        
      }
    },
    decode:(alink)=>{
      const str=alink.replace("anchor://","");
      const arr=str.split("/");
      const block=parseInt(arr.pop());
      if(isNaN(block)) return false;
      return {name:arr.join("/"),block:block};
    },
    getBounty:(val,ck)=>{
      const chain=Network("anchor");      //bounty data is base on Anchor Network
      chain.view(val,"anchor",(res)=>{
        //console.log(res);
        return ck && ck(res);
      });
    },
    getNetworkByCoin:(coin)=>{
      const ns=Config.get("network");
      for(var k in ns){
        if(ns[k].coin===coin && ns[k].enable) return k;
      }
      return false;
    },
    autoSet:(alink)=>{
      const bounty=self.decode(alink);
      if(bounty){
        self.getBounty(bounty,(data)=>{
          if(!data.raw || !data.raw.coin) return props.callback && props.callback({error:"Invalid bounty anchor"});
          const coin=data.raw.coin;
          const net=self.getNetworkByCoin(coin.toUpperCase());
          if(net!==false){
            setReady(true);
            setNetwork(net);
          }
        });
      }
    },
  }

  useEffect(() => {
    if(props.bounty) self.autoSet(props.bounty);
  }, [props.bounty]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col className='pt-1' md={size.transaction[0]} lg={size.transaction[0]} xl={size.transaction[0]} xxl={size.transaction[0]}>
        <button className={payed ? 'btn btn-sm btn-default' : 'btn btn-sm btn-primary'} onClick={(ev) => {
          self.clickPayed(ev)
        }}><FaCheck /></button>
      </Col>
      <Col hidden={payed} className='' md={size.transaction[1]} lg={size.transaction[1]} xl={size.transaction[1]} xxl={size.transaction[1]}>
        <input className='form-control' type="text" placeholder='Transaction hash' onChange={(ev)=>{
          self.changeHash(ev);
        }}/>
      </Col>
      <Col hidden={!payed} className='' md={size.transaction[1]} lg={size.transaction[1]} xl={size.transaction[1]} xxl={size.transaction[1]}>
        
      </Col>
      <Col className='text-end' md={size.transaction[2]} lg={size.transaction[2]} xl={size.transaction[2]} xxl={size.transaction[2]}>
        <button className='btn btn-md btn-primary' disabled={!ready} onClick={(ev)=>{
          self.clickSign();
        }}>{title}</button>
      </Col>
      <Col className='text-end text-danger' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
    </Row>
  );
}
export default BountyPay;