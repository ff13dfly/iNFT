import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import tools from "../../lib/tools";
import Config from "../../system/config";
import RUNTIME from "../../system/runtime";

/* Pay for ticket component
*   @param  {string}    bounty       //bounty_name, alink of bounty
*/

function BountyTicket(props) {
  const size = {
    row: [12],
    left:[8,4],
  };

  let [hidden, setHidden] = useState(true);
  let [price, setPrice] = useState(0);
  let [info, setInfo]= useState("Checking");

  const self = {
    clickBuyTicket:(ev)=>{
      console.log(`Here to buy ticket, price:${price},bounty:${props.bounty}`);
      const dapp = Config.get(["system", "name"]);
      const param=tools.decode(props.bounty);
      param.price=price;
      const chain=Network("anchor");
      chain.bounty.ticket(dapp,param,(res)=>{
        console.log(res);
      });
    },
    checkBounty:(alink)=>{
      //1. wether bounty exsist
      const data=tools.decode(alink);
      const chain=Network("anchor");
      chain.bounty.exsist(data.name,data.block,(bt)=>{
        if(bt===false){
          setInfo("No such bounty.");
          return setHidden(true);
        } 
        setPrice(parseFloat(bt.price/chain.divide()));

        //2.wether the owner of bounty
        chain.view(data, "anchor", (dt) => {
          RUNTIME.auto((addr)=>{
            console.log(dt,addr===dt.owner);
            if(addr===dt.owner){
              setInfo("Your own bounty.");
              return setHidden(true);
            } 

            //3.wether bought ticket yet
            chain.bounty.check(data.name,data.block,addr,(bought)=>{
              if(bought===true){
                setInfo("Bought already.");
                return setHidden(true);
              }  
              setHidden(false);
            });
            
          });
        });
      });
    },
  }

  useEffect(() => {
    if(props.bounty) self.checkBounty(props.bounty);
  }, [props.bounty]);

  return (
    <Row className="ticket-buying pt-4 pb-4 mr-5 ml-5">
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        Ticket <strong>{price}</strong> $ANK to join!
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-warning" disabled={hidden} onClick={(ev)=>{
          self.clickBuyTicket(ev);
        }}>Buy Ticket!</button>
        <small>{info}</small>
      </Col>
    </Row>
  );
}
export default BountyTicket;