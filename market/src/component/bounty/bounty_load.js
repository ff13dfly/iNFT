import { Row, Col } from "react-bootstrap";
import { useState } from "react";

import API from "../../system/api";
import Bounty from "../../system/bounty";
import Network from "../../network/router";

import tools from "../../lib/tools";

/* Template creator basic setting
*   @param  {function}    callback        //callback to 
*/

function BountyLoad(props) {
  const size = {
    row: [12],
    right:[8,4]
  };

  let [bounty, setBounty]=useState("");
  let [info, setInfo]=useState("");

  const self={
    changeBounty:(ev)=>{
      setBounty(ev.target.value);
    },
    clickLoad:()=>{
      setInfo("");
      if(!bounty) return setInfo("Please input the bounty alink");
      
      const chain=Network("anchor");
      const ank=tools.decode(bounty);

      if(ank===false) return setInfo("Invalid bounty alink");

      chain.view(ank,"anchor",(data)=>{
        console.log(data);

        setBounty("");        //clean the bounty alink to avoid multi insert
        //1. no target anchor data
        if(data===false) {
          return setInfo("No such bounty");
        }

        //2. not a bounty anchor
        if(data.protocol.tpl!=="bounty") return setInfo("Invalid bounty anchor protocol");

        //3. check wether registered
        API.bounty.view(bounty,(res)=>{

          //4. save to local indexedDB
          Bounty.exsist(bounty,(exsist)=>{
            if(exsist) return setInfo("Already launched.");
            const more=data.raw;
            const row=Bounty.format.local(bounty,data.owner,more);

            //4.1. add register status;
            row.register=res.success?true:false;

            Bounty.insert(row,(res)=>{
              //5. callback to fresh bounty list
              if(res===true && props.callback) props.callback(bounty);
            });
          });
        });
      });
    }
  }

  return (
      <Row className="pt-2">
        <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
          <input className="form-control" type="text" 
            placeholder="Input the bounty anchor link to load" 
            value={bounty}
            onChange={(ev)=>{
              self.changeBounty(ev);
            }}
          />
        </Col>
        <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
            <button className="btn btn-md btn-primary" onClick={(ev)=>{
              self.clickLoad();
            }}>Load Bounty</button>
        </Col>
        <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>{info}</Col>
    </Row>
  );
}
export default BountyLoad;