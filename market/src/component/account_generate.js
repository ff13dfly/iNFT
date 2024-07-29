import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import AccountLoad from './account_load';

import Account from "../system/account";
import Config from "../system/config";
import tools from "../lib/tools";

function AccountGenerate(props) {
  const size = {
    row: [12],
  };


  let [networks, setNetworks]=useState([]);
  let [current, setCurrent] =useState("");

  const self={
    changeNetwork:(ev)=>{
      setCurrent(ev.target.value);
    },
    getNetworks:(ck)=>{
        if(networks.length!==0) return ck && ck(networks);
        const ns=Config.get("network");
        for(var k in ns){
          const row=ns[k];
          if(row.enable && row.support && row.support.minting){
            row.name=k;
            networks.push(row);
          } 
        }
        return ck && ck( tools.clone(networks));
    },
    fresh:()=>{
      self.getNetworks((ns)=>{
        setCurrent(ns[0].name);
        setNetworks(ns);
      });
    },
  }
  
  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
      <select className='form-control' onChange={(ev)=>{
          self.changeNetwork(ev);
        }} value={current}>
          {networks.map((row, index) => (
            <option key={index} value={row.name}>{ tools.toUp(row.name)} Network</option>
          ))}
        </select>
      </Col>
    </Row>
  );
}
export default AccountGenerate;