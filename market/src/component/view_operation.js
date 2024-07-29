import { Row, Col, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

import AccountSelector from './account_selector';

import { FaCheck } from "react-icons/fa";

import Network from '../network/router';
import Account from '../system/account';

function OperationView(props) {
  const size = {
    row: [12],
    left: [4, 8],
  };

  let [wallet, setWallet] = useState(true);
  let [info, setInfo] = useState("");

  const self = {
    changeAccount: (addr) => {
      console.log(addr);
    },
  }

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  return (
    <Row>
      <Col className='text-end' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <button className='btn btn-sm btn-primary'><FaCheck /> Wallet</button> 
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
            <small>Select account to filter iNFTs</small>
            <AccountSelector callback={(addr) => {
              self.changeAccount(addr);
            }} />
          </Col>
        </Row>
      </Col>
      <Col className='text-end' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
    </Row>
  );
}
export default OperationView;