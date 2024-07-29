import { Row, Col } from 'react-bootstrap';

import { useEffect, useState } from "react";

import AccountSelector from './account_selector';

import Network from "../network/router";
import Account from "../system/account";
import Config from "../system/config";

import { FaCheck } from "react-icons/fa";

/* iNFT render component parameters
*   @param  {string}    title           //button title
*   @param  {string}    network         //network to filter account
*   @param  {function}  [callback]      //callback function 
*/

function AccountSign(props) {
  const size = {
    row: [12],
    buy: [1,5,4,2],
  };

  let [wallet, setWallet] = useState(true);
  let [info, setInfo] = useState("");
  let [address, setAddress]= useState("");
  let [balance,setBalance] = useState(0);
  let [password, setPassword] = useState("");

  const chain=Network(props.network);

  const self = {
    changeAccount:(addr)=>{
      setInfo("");
      chain.balance(addr,(res)=>{
        console.log(res);
        const val=res.free/chain.accuracy();
        setBalance(val);
      });
      setAddress(addr);
    },
    changePassword:(ev)=>{
      setPassword(ev.target.value);
    },
    clickWallet:()=>{
      setWallet(!wallet);
    },
    clickSign:(ev)=>{
      setInfo("");
      if(!wallet){
        self.getPair((pair)=>{
          setPassword("");
          if(pair!==false && props.callback) props.callback({wallet:wallet,signer:pair});
        });
      }else{
        console.log(`Wallet to approve`);
        const dapp = Config.get(["system", "name"]);
        chain.wallet(dapp,(injector)=>{
          if(injector.error) return setInfo(injector.error);
          if(props.callback) props.callback({wallet:wallet,signer:injector.signer});
        });
      }
    },
    getPair:(ck)=>{
      Account.get(address,(res)=>{
        if(!res || res.length===0){
          setInfo("No such account");
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
  }

  useEffect(() => {

  }, [props.network]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col className='pt-1' md={size.buy[0]} lg={size.buy[0]} xl={size.buy[0]} xxl={size.buy[0]}>
        <button className={wallet ? 'btn btn-sm btn-default' : 'btn btn-sm btn-primary'} onClick={(ev) => {
          self.clickWallet(ev)
        }}><FaCheck /></button>
      </Col>
      <Col hidden={wallet} className='' md={size.buy[1]} lg={size.buy[1]} xl={size.buy[1]} xxl={size.buy[1]}>
        <AccountSelector network={"anchor"} callback={(addr) => {
          self.changeAccount(addr);
        }} />
        <small>Balance: {balance}</small>
      </Col>
      <Col hidden={!wallet} className='pt-2' md={size.buy[1]} lg={size.buy[1]} xl={size.buy[1]} xxl={size.buy[1]}>
        Check to select accounts to buy.
      </Col>
      <Col hidden={wallet} md={size.buy[2]} lg={size.buy[2]} xl={size.buy[2]} xxl={size.buy[2]}>
        <input type="password" className='form-control' placeholder='password for account' value={password} onChange={(ev)=>{
          self.changePassword(ev);
        }}/>
      </Col>
      <Col hidden={!wallet} md={size.buy[2]} lg={size.buy[2]} xl={size.buy[2]} xxl={size.buy[2]}>
      </Col>
      <Col className='text-end' md={size.buy[3]} lg={size.buy[3]} xl={size.buy[3]} xxl={size.buy[3]}>
        <button className='btn btn-md btn-primary' onClick={(ev)=>{
          self.clickSign();
        }}>{props.title}</button>
      </Col>
      <Col className='text-end text-danger' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
    </Row>
  );
}
export default AccountSign;