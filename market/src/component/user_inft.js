import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import AccountSelector from './account_selector';
import ListNFTs from './list_nfts';
import Page from './common_page';

import API from '../system/api';
import INFT from '../system/inft';

function UserINFT(props) {
  const size = {
    row: [12],
    left: [8, 4],
  };

  //let [address,setAddress]=useState("");
  let [list, setList]=useState([]);

  const self = {
    changeAccount:(addr)=>{
      //console.log(addr);
      //setAddress(addr);
      self.fresh(addr);
    },
    getAnchorArray:(arr)=>{
      const narr=[];
      for(let i=0;i<arr.length;i++){
        const row=arr[i];
        narr.push({name:row.name,block:row.block});
      }
      return narr;
    },
    fresh:(addr)=>{
      API.list.byAddress(addr,(res)=>{
        if(!res || !res.data || res.data.length!==0){
          const narr=self.getAnchorArray(res.data);
          console.log(narr);
          INFT.multi(narr,(ans)=>{
            console.log(ans);
            setList(ans);
          });
        } 
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
      <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Page  show={true} align={"right"} now={3} step={5} total={12} callback={(n)=>{
          console.log(n);
        }}/>
        <ListNFTs data={list} />
      </Col>
    </Row>
  );
}
export default UserINFT;