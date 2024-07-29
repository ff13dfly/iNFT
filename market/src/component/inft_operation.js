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
  };

  let [ enable, setEnable ]=useState({
    sell:true,
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
      //console.log(price);
      console.log(props.data);
      const name=props.data.name;
      const target=props.data.owner;
      const chain=Network("anchor");
      Account.get(target,(res)=>{
        if(!res || res.length===0){
          return setInfo("Invalid iNFT to set sell status");
        }
        const fa=JSON.stringify(res[0]);
        chain.load(fa, password, (pair)=>{
          if(pair.error){
            return setInfo(pair.error);
          }
          chain.sell(pair,name,price,(status)=>{
            setInfo(status.msg);


          }); 
        });
      });
    },
  }

  useEffect(() => {
    console.log(props.data);
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
          <Col className='text-end'  md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {info}
          </Col>
        </Row>
      </Col> 

      <Col hidden={!enable.revoke}  md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
          
          </Col>
          <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            <button className='btn btn-md btn-primary'>Revoke</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default OperationINFT;