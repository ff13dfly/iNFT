import { Row, Col, Image } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Config from "../system/config";
import RUNTIME from '../system/runtime';

function UserBasic(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [thumb, setThumb] = useState(""); 
  let [address,setAddress]= useState("");

  const self = {
    getAvatar: () => {
      const cfg = Config.get(["system", "avatar"]);
      const addr=RUNTIME.account.get();
      return `${cfg.base}/${addr}.png${cfg.set}`;
    },
    fresh:()=>{
      const url=self.getAvatar();
      setThumb(url);
      setAddress(tools.shorten(RUNTIME.account.get()),16);
    },
    isAddressSetting:()=>{
      return Config.exsist(address);
    },
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Manage Account Detail</h5>
        <small>Overview of manage account.</small>
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Summary Of Manager Account
      </Col>
      <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <h5>Manager</h5>
        <Image
          src={thumb}
          rounded
          width="100%"
          style={{ minHeight: "80px" }}
        />
        <h6>{address}</h6>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Local setting</h5>
        <hr />
      </Col>

      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        Checking local setting files.
        <input className='form-control' type="password" placeholder='Password to access local data.' />
      </Col>
      <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className='btn btn-md btn-danger' disabled={self.isAddressSetting()}>
          Clean Account Setting
        </button>
      </Col>
    </Row>
  );
}
export default UserBasic;