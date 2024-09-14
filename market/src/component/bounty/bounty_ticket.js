import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import tools from "../../lib/tools";


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

  const self = {
    clickBuyTicket:(ev)=>{

    },
    checkTicket:(addr,bounty,block,ck)=>{

    },
    checkBounty:(alink)=>{
      const data=tools.decode(alink);
      const chain=Network("anchor");
      chain.bounty.exsist(data.name,data.block,(bt)=>{

        if(bt===false) setHidden(true);

        setPrice(parseFloat(bt.price/chain.divide()));
      });
    },
  }

  useEffect(() => {
    //console.log(props);
    if(props.bounty) self.checkBounty(props.bounty);
  }, [props.bounty]);

  return (
    <Row show={(!hidden).toString()} className="ticket-buying pt-4 pb-4 mr-5 ml-5">
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        Ticket <strong>{price}</strong> $ANK to join!
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-warning" onClick={(ev)=>{
          self.clickBuyTicket(ev);
        }}>Buy Ticket!</button>
      </Col>
    </Row>
  );
}
export default BountyTicket;