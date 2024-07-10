import { Row, Col, Table, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaRegCopy, FaCopy, FaFileDownload, FaSkullCrossbones } from "react-icons/fa";

import Account from "../system/account";

import INDEXED from '../lib/indexed';
import Config from '../system/config';

function AccountList(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [list, setList] = useState([]);

  const nameDB =Config.get(["storage","DBname"]);
  const table="accounts";

  const self = {
    clickRemove:(addr)=>{
      INDEXED.checkDB(nameDB, (db) => {
        if (INDEXED.checkTable(db.objectStoreNames, table)) {
          INDEXED.removeRow(db,table,"address",addr,(done)=>{
            if(done) self.fresh();
          });
        }
      });
    },
    fresh: () => {
      //console.log("force to fresh.");
      Account.list({}, (data) => {
        setList(data);
      });
    },
  }

  useEffect(() => {
    self.fresh();
  }, [props.update]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Network</th>
              <th>Address</th>
              <th>Default</th>
              <th>Balance</th>
              <th>Wallet</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={index}>
                <td>{row.network}</td>
                <td>
                  <span className='pointer'><FaRegCopy /></span>
                  <span className='ml-5'>{row.address}</span>
                </td>
                <td>
                  <Form>
                    <Form.Check // prettier-ignore
                      type="switch"
                      label=""
                      onChange={(ev) => {

                      }}
                    />
                  </Form>
                </td>
                <td>0</td>
                <td>Subwallet | Polkadot</td>
                <td>
                  <span className='pointer' onClick={(ev)=>{
                    self.clickRemove(row.address);
                  }}><FaSkullCrossbones /></span>
                  <span className='pointer ml-5'><FaFileDownload /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>

    </Row>
  );
}
export default AccountList;