import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import AccountLoad from './account_load';

import Account from "../system/account";
import Config from "../system/config";
import tools from "../lib/tools";

import { FaRegPlusSquare,FaUpload } from "react-icons/fa";

function AccountAdd(props) {
  const size = {
    row: [12],
    account: [6, 6],
  };

  let [networks, setNetworks]=useState([]);
  let [current, setCurrent] =useState("");
  
  const self={
    changeNetwork:(ev)=>{
      setCurrent(ev.target.value);
    },
    clickAdd:(ev)=>{
      console.log("Click adding button,"+current);
      Account.generate(current,()=>{

      });
      if(props.fresh) props.fresh();
    },
    clickImport:(ev)=>{
      if(props.dialog){
        props.dialog(<AccountLoad network={current} callback={()=>{

        }}/>,`Import Account ( ${tools.toUp(current)} Network )`)
      }
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
  }, [props.update]);

  return (
    <Row>
      <Col md={size.account[0]} lg={size.account[0]} xl={size.account[0]} xxl={size.account[0]}>
        <select className='form-control' onChange={(ev)=>{
          self.changeNetwork(ev);
        }} value={current}>
          {networks.map((row, index) => (
            <option key={index} value={row.name}>{ tools.toUp(row.name)} Network</option>
          ))}
        </select>
      </Col>
      <Col md={size.account[1]} lg={size.account[1]} xl={size.account[1]} xxl={size.account[1]}>
        <button className='btn btn-md btn-primary' onClick={(ev)=>{
          self.clickAdd(ev);
        }}><FaRegPlusSquare size={18}/></button>
        <button className='btn btn-md btn-primary ml-5' onClick={(ev)=>{
          self.clickImport(ev);
        }}><FaUpload size={18}/></button>
      </Col>
    </Row>
  );
}
export default AccountAdd;