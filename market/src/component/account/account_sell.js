import { Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";

import tools from "../../lib/tools";
import Network from "../../network/router";
import Account from "../../system/account";

/* iNFT sell/revoke action panel
*   @param  {string}    props.anchor           //anchor link
*/

function AccountSell(props) {
  const size = {
    row: [12],
    half: [6],
    left: [8, 4],
  };

  let [hidden, setHidden] = useState(true);        //wethe show this component
  let [password, setPassword] = useState("");       //password value
  let [price, setPrice] = useState("");            //price to sell
  let [info, setInfo] = useState("");             //infomation
  let [owner, setOwner] = useState("");           //owner of anchor
  let [disable, setDisable] = useState(true);     //set the sell button status
  let [revoke, setRevoke]= useState(false);       //revoke setting


  const self = {
    changePassword: (ev) => {
      setPassword(ev.target.value);

      if(!revoke){
        setDisable((!ev.target.value || !price) ? true : false);
      }else{
        setDisable(!ev.target.value ? true : false);
      }
    },
    changePrice: (ev) => {
      setPrice(ev.target.value);
      setDisable((!password || !ev.target.value) ? true : false);
    },
    clickSell: (ev) => {
      setDisable(true);
      Account.get(owner, (arr) => {
        if (arr.length !== 1) return setInfo("Invalid account.");
        const fs = arr[0];
        const chain = Network("anchor");
        try {
          chain.load(JSON.stringify(fs), password, (pair) => {
            if (pair.error) {
              return setInfo(pair.error);
            }
            setPassword("");
            const bk = tools.decode(props.anchor);
            const amount = parseInt(parseFloat(price) * chain.divide());
            chain.sell(pair, bk.name, amount, (res) => {
              if (res.error) return setInfo(res.error);
              setInfo(res.msg);
              if (res.status === "Finalized") {
                //INFT.single.selling(bk.name, amount, pair.address);
                self.fresh(props.anchor);
              }
            });
          });
        } catch (error) {
          setInfo('Failed to set selling.');
        }
      });
    },
    clickRevoke:(ev)=>{
      setDisable(true);
      Account.get(owner, (arr) => {
        if (arr.length !== 1) return setInfo("Invalid account.");
        const fs = arr[0];
        const chain = Network("anchor");
        chain.load(JSON.stringify(fs), password, (pair) => {
          if (pair.error) {
            return setInfo(pair.error);
          }
          setPassword("");
          const bk = tools.decode(props.anchor);
          chain.revoke(pair, bk.name, (res) => {
            if (res.error) return setInfo(res.error);
            setInfo(res.msg);
            if (res.status === "Finalized") {
              self.fresh(props.anchor);
            }
          });
        });
      });
    },
    clean:()=>{
      setInfo("");
      setPrice("");
      setPassword("");
    },
    fresh: (alink) => {
      self.clean();
      const bk = tools.decode(alink);
      const chain = Network("anchor");
      chain.view(bk, "anchor", (data) => {
        if (data.error) return setInfo(data.error);
        setOwner(data.owner);

        Account.map(() => {
          if (!Account.exsist(data.owner)) return setHidden(true);
          chain.view(data.name, "selling", (dt) => {
            if (dt !== false){
              setRevoke(true);
            }else{
              setRevoke(false);
            }
            setHidden(false);
          });
        });
      });
    },
  }

  useEffect(() => {
    if (props.anchor) {
      self.fresh(props.anchor);
    }
  }, [props.anchor]);

  return (
    <Row className="pt-2" hidden={hidden}>
      <Col hidden={revoke} md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <input type="number" className="form-control" placeholder="Price to sell" value={price} onChange={(ev) => {
          self.changePrice(ev);
        }} />
      </Col>
      <Col hidden={!revoke} md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>

      </Col>
      <Col className="text-end pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        {info}
      </Col>
      <Col className="pt-2" lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <input type="password" className="form-control" placeholder={`Password of ${tools.shorten(owner, 4)}`} value={password} onChange={(ev) => {
          self.changePassword(ev);
        }} />
      </Col>
      <Col className="pt-2 text-end" hidden={revoke} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev) => {
          self.clickSell(ev);
        }}>Sell</button>
      </Col>

      <Col className="pt-2 text-end" hidden={!revoke} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev) => {
          self.clickRevoke(ev);
        }}>Revoke</button>
      </Col>
    </Row>
  );
}
export default AccountSell;