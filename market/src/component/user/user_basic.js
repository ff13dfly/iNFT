import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import UseCharge from "./user_charge";

import Copy from "../../lib/clipboard";
import tools from "../../lib/tools";
import Network from "../../network/router";

import Config from "../../system/config";
import RUNTIME from "../../system/runtime";
import Account from "../../system/account";

import { FaCopy, FaFileDownload } from "react-icons/fa";

function UserBasic(props) {

  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [thumb, setThumb] = useState("");
  let [address, setAddress] = useState("");
  let [balance, setBalance] = useState(0);

  let [recover, setRecover] = useState({});   //button recover status

  const self = {
    clickCharge: (ev) => {
      if (props.dialog) props.dialog.show(<UseCharge dailog={props.dialog} />, "Account Charge");
    },
    clickAddress: (addr) => {
      //console.log(addr);
      Copy(addr);
    },
    clickDownload:(addr)=>{
      //console.log(addr);
      Account.get(addr,(dt)=>{
        console.log(dt);
      });
    },
    getAvatar: () => {
      const cfg = Config.get(["system", "avatar"]);
      const addr = RUNTIME.account.get();
      return `${cfg.base}/${addr}.png${cfg.set}`;
    },
    callRecover: (key, at) => {
      if (!recover[key]) {
        recover[key] = "text-warning";
        setRecover(tools.copy(recover));
        setTimeout(() => {
          delete recover[key];
          setRecover(tools.copy(recover));
        }, !at ? 1000 : at);
      }
    },
    fresh: () => {
      const url = self.getAvatar();
      const addr = RUNTIME.account.get();
      if (!addr || addr === null) return setTimeout(() => {
        self.fresh();
      }, 500);

      setThumb(url);
      setAddress(addr, 16);

      const chain = Network("anchor")
      chain.balance(addr, (res) => {
        const free = parseInt(res.free);
        const val = free / chain.divide();
        setBalance(val.toLocaleString());
      });
    },
    isAddressSetting: () => {
      return Config.exsist(address);
    },
  }

  useEffect(() => {
    //console.log(props);
    self.fresh();
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Manage Account Detail</h5>
        <small>Overview of manage account.</small>
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
            Balance: <strong>{balance}</strong> $ANK

          </Col>
          <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            <button className="btn btn-md btn-primary" onClick={(ev) => {
              self.clickCharge(ev);
            }}>Charge</button>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Network: <strong>Anchor Network</strong>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            This account is for writting data to Anchor Network.
          </Col>
        </Row>

      </Col>
      <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
            <h5>Manager</h5>
          </Col>
          <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            <button className="btn btn-sm btn-secondary" onClick={(ev)=>{
              self.clickDownload(address);
            }}>
              <FaFileDownload size={18}/>
            </button>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Image
              src={thumb}
              rounded
              width="100%"
              style={{ minHeight: "80px" }}
            />
            <h6 className="pointer pt-4" onClick={(ev) => {
              self.clickAddress(address);
              self.callRecover("address");
            }}>
              {tools.shorten(address)} <FaCopy className={!recover.address ? "ml-5" : `ml-5 ${recover.address}`} />
            </h6>
          </Col>
        </Row>
      </Col>

      {/* <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Local setting</h5>
        <hr />
      </Col>

      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        Checking local setting files.
        <input className="form-control" type="password" placeholder="Password to access local data." />
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-danger" disabled={self.isAddressSetting()}>
          Clean Account Setting
        </button>
      </Col> */}
    </Row>
  );
}
export default UserBasic;