import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Pay for ticket component
*   @param  {string}    bounty       //bounty_name, alink of bounty
*/

function BountyTicket(props) {
  const size = {
    row: [12],
    left:[8,4],
  };

  let [hidden, setHidden] = useState(true);
  let [info, setInfo] = useState("Ticket 0.2 $ANK to join!");

  const self = {
    clickBuyTicket:(ev)=>{

    },
    checkTicket:(addr,bounty,block,ck)=>{

    },
  }

  useEffect(() => {
    console.log(props);
  }, [props.bounty]);

  return (
    <Row show={(!hidden).toString()} className="ticket-buying pt-4 pb-4 mr-5 ml-5">
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        {info}
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-sm btn-primary" onClick={(ev)=>{
          self.clickBuyTicket(ev);
        }}>Buy Now!</button>
      </Col>
    </Row>
  );
}
export default BountyTicket;