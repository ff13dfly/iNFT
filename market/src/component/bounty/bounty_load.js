import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

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
      const chain=Network("anchor");
      const ank=tools.decode(bounty);
      //console.log(ank);
      chain.view(ank,"anchor",(data)=>{
        setBounty("");        //clean the bounty alink to avoid multi insert
        if(data===false) {
          return setInfo("No such bounty");
        }

        Bounty.exsist(bounty,(exsist)=>{
          if(exsist) return setInfo("Already launched.");

          const more=data.raw;
          const row=Bounty.format.local(bounty,data.owner,more);
          console.log(row);
          Bounty.insert(row,(res)=>{
            if(res===true && props.callback) props.callback(bounty);
          });
        });
      });
      
      // API.bounty.view(bounty,(res)=>{
      //   console.log(res);
      //   if(!res.success){
      //     return setInfo("No target bounty.");
      //   }
        
      //   setBounty("");
        
      //   const chain=Network("anchor");
      //   const name=self.getName(res.data.alink);
      //   chain.view(name,"owner",(dt)=>{
      //     const data=Bounty.convert(res.data,dt.address);
      //     console.log(data);
      //   });
      // });
    }
  }
  useEffect(() => {

  }, []);

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