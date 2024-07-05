import { Row, Col, Image } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Config from "../system/setting";
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

  const self = {
    getAvatar: () => {
      const cfg = Config.get(["system", "avatar"]);
      const addr=RUNTIME.account.get();
      return `${cfg.base}/${addr}.png${cfg.set}`;
    },
  }

  useEffect(() => {
    const url=self.getAvatar();
    setThumb(url);
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Manage Account</h5>
        <small>Overview of account</small>
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Summary of Account about iNFT.
      </Col>
      <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Image
          src={thumb}
          rounded
          width="100%"
          style={{ minHeight: "80px" }}
        />
      </Col>
    </Row>
  );
}
export default UserBasic;