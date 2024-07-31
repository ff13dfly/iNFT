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

  let [title, setTitle]=useState(props.title);

  let [hash,setHash]= useState("");

  const chain=Network(props.network);

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
        
      }else{
        
      }
    },
  }

  useEffect(() => {

  }, [props.network]);

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
        <button className='btn btn-md btn-primary' onClick={(ev)=>{
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