import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Network from '../network/router';

import Account from '../system/account';

function OperationINFT(props) {
  const size = {
    row: [12],
    left:[8,4],
    right:[4,8],
    sell:[4,6,2],
    revoke:[4,6,2],
  };

  let [ enable, setEnable ]=useState({
    sell:false,
    revoke:false,
  }); 
  let [price, setPrice] = useState(0);
  let [password, setPassword]= useState("");
  let [info, setInfo] = useState("");

  const self={
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    clickSell:(ev)=>{
      const name=props.data.name;
      const target=props.data.owner;
      const chain=Network("anchor");
      self.getPair(target,(pair)=>{
        if(pair){
          chain.sell(pair,name,price,(progress)=>{
            setInfo(progress.msg);
            if(progress.status==="Finalized"){
              setTimeout(() => {
                props.dialog.close();
              }, 500);
            }
          });
        }
      });
    },
    clickRevoke:(ev)=>{
      const name=props.data.name;
      const target=props.data.owner;
      const chain=Network("anchor");
      self.getPair(target,(pair)=>{
        if(pair){
          chain.revoke(pair,name,(progress)=>{
            setInfo(progress.msg);
            if(progress.status==="Finalized"){
              setTimeout(() => {
                props.dialog.close();
              }, 500);
            }
          });
        }
      });
    },
    getPair:(target,ck)=>{
      const chain=Network("anchor");
      Account.get(target,(res)=>{
        if(!res || res.length===0){
          setInfo("Invalid iNFT to set sell status");
          return ck && ck(false);
        }
        const fa=JSON.stringify(res[0]);
        chain.load(fa, password, (pair)=>{
          if(pair.error){
            setInfo(pair.error);
            return ck && ck(false);
          }
          return ck && ck(pair);
        });
      });
    },
    fresh:()=>{
      //console.log(props.data);
      const chain=Network("anchor");
      chain.view(props.data.name,"selling",(res)=>{
        if(res===false){
          setEnable({
            sell:true,
            revoke:false,
          })
        }else{
          setEnable({
            sell:false,
            revoke:true,
          })
        }
      });
    },
  }

  useEffect(() => {
    self.fresh();
    //console.log(props.dialog);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
            <img className='inft_thumb' src={props.data.bs64} alt="thumb of iNFT" />
          </Col>
          <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
            More details.
          </Col>
        </Row>
      </Col>

      <Col className='pt-2' hidden={!enable.sell} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.sell[0]} lg={size.sell[0]} xl={size.sell[0]} xxl={size.sell[0]}>
            <input className='form-control' type="number" value={price} placeholder='Set the price to sell' onChange={(ev)=>{
              self.changePrice(ev);
            }}/>
          </Col>
          <Col md={size.sell[1]} lg={size.sell[1]} xl={size.sell[1]} xxl={size.sell[1]}>
            <input className='form-control' type="password" value={password} placeholder='Password of account' onChange={(ev)=>{
              self.changePassword(ev);
            }}/>
          </Col>
          <Col className='text-end' md={size.sell[2]} lg={size.sell[2]} xl={size.sell[2]} xxl={size.sell[2]}>
            
            <button className='btn btn-md btn-primary' onClick={(ev)=>{
              self.clickSell(ev);
            }}>Sell</button>
          </Col>
        </Row>
      </Col> 

      <Col hidden={!enable.revoke}  md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.revoke[0]} lg={size.revoke[0]} xl={size.revoke[0]} xxl={size.revoke[0]}>
          
          </Col>
          <Col className='text-end' md={size.revoke[1]} lg={size.revoke[1]} xl={size.revoke[1]} xxl={size.revoke[1]}>
            <input className='form-control' type="password" value={password} placeholder='Password of account' onChange={(ev)=>{
              self.changePassword(ev);
            }}/>
          </Col>
          <Col className='text-end' md={size.revoke[2]} lg={size.revoke[2]} xl={size.revoke[2]} xxl={size.revoke[2]}>
            <button className='btn btn-md btn-primary'onClick={(ev)=>{
              self.clickRevoke(ev);
            }}>Revoke</button>
          </Col>
        </Row>
      </Col>

      <Col className='text-end'  md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
    </Row>
  );
}
export default OperationINFT;