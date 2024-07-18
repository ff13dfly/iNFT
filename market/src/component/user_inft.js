import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import AccountSelector from './account_selector';
import ListNFTs from './list_nfts';

import API from '../system/api';

function UserINFT(props) {
  const size = {
    row: [12],
    left: [8, 4],
  };

  let [address,setAddress]=useState("");
  let [list, setList]=useState([]);

  const self = {
    changeAccount:(addr)=>{
      //console.log(addr);
      setAddress(addr);
      self.fresh(addr);
    },
    fresh:(addr)=>{
      //console.log(addr);
      API.list.byAddress(addr,(res)=>{
        console.log(res);
      });
    },
  }

  useEffect(() => {
    
  }, []);

  return (
    <Row>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <small>Select account to filter iNFTs</small>
        <AccountSelector callback={(addr)=>{
          self.changeAccount(addr);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <ListNFTs data={list} />
      </Col>
    </Row>
  );
}
export default UserINFT;