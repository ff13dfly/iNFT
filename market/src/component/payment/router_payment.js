import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import PaymentAnchor from "./payment_anchor";
import PaymentPolkadot from "./payment_polkadot";
import PaymentSolana from "./payment_solana";
import TokenEtherum from "./token_etherum";
import TokenPolkadot from "./token_polkadot";
import TokenSolana from "./token_solana";

import Bounty from "../../system/bounty";
import API from "../../system/api";
import tools from "../../lib/tools";

/* Payment router, by checking coin symbol to load proper payment component.
*   @param  {string}    bounty        //amount of payment;
*   @param  {function}  callback      //ck(amount, {from:"",to:""},{type:"",hash:""}), payment details
*/

function RouterPayment(props) {
  const size = {
    row: [12],
  };

  let [info, setInfo] =useState("");          //info to show
  let [content, setContent] =useState("");    //target payment component

  let [target, setTarget]=useState("");     //payment target address
  let [amount, setAmount]=useState(0);      //amount of payment

  //router to payment
  const router={
    coin:{
      anchor:<PaymentAnchor target={target} amount={amount} callback={props.callback}/>,
      polkadot:<PaymentPolkadot target={target} amount={amount} callback={props.callback}/>,
      solana:<PaymentSolana target={target} amount={amount} callback={props.callback}/>,
    },
    token:{
      etherum:<TokenEtherum target={target} amount={amount} callback={props.callback}/>,
      polkadot:<TokenPolkadot target={target} amount={amount} callback={props.callback}/>,
      solana:<TokenSolana target={target} amount={amount} callback={props.callback}/>,
    },
  }

  const self = {
    //get the target token/coin router to pay
    getPaymentBySymbol:(coin)=>{

      return {type:"coin",network:"anchor"}
      //return {type:"coin",network:"solana"}
    },
    calcAmount: (bonus) => {
      let n = 0;
      for (let i = 0; i < bonus.length; i++) {
        const row = bonus[i];
        n += row.amount * row.bonus;
      }
      return n;
    },
    autoSet:(bonus,coin,ck)=>{
      //1.set the amount of payment;
      const n=self.calcAmount(bonus);

      //2.set the receiver of the payment;
      //check target to avoid multi request to portal API
      if(!target){
        API.bounty.target(coin,(res)=>{
          if(!res.success || !res.target) return setInfo(`Failed to get the target account.`);
          return ck && ck(n,res.target);
        });
      }else{
        return ck && ck(n);
      }
    },
  }

  useEffect(() => {
    if(!props.bounty){
      setInfo(`Invalid bounty link, nothing to do.`);
    }else{
      Bounty.get(props.bounty,(bty)=>{
        if(bty.error) return setInfo(bty.error);
        
        const pay=self.getPaymentBySymbol(bty.coin);
        self.autoSet(bty.bonus,bty.coin,(n,addr)=>{
          //1.set the target account and amount
          setAmount(n);
          if(addr!==undefined)setTarget(addr);

          //2.router to the target payment component
          if(router[pay.type] && router[pay.type][pay.network]){
            setContent(router[pay.type][pay.network]);
          }else{
            setInfo(`Payment is not support yet. Raw: ${JSON.stringify(pay)}`);
          }
        });
      });
    }
  }, [target]);   //must related to `target` to pass the value to sub component

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {content}
      </Col>
    </Row>
  );
}
export default RouterPayment;