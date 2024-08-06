import { Row, Col, Table, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import {  FaCopy, FaFileDownload, FaSkullCrossbones } from "react-icons/fa";

import Account from "../system/account";

import INDEXED from "../lib/indexed";
import Copy from "../lib/clipboard";
import tools from "../lib/tools";

import Config from "../system/config";

function AccountList(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [list, setList] = useState([]);
  let [balances,setBalances]= useState({});
  let [recover, setRecover] = useState({});

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
    clickCopy:(address)=>{
      Copy(address);
    },
    callRecover:(key, at) => {
      if (!recover[key]) {
          recover[key] = "text-warning";
          setRecover(tools.copy(recover));
          setTimeout(() => {
              delete recover[key];
              setRecover(tools.copy(recover));
          }, !at ? 1000 : at);
      }
    },
    getDate:(stamp)=>{
      const dt=new Date(stamp);
      return`${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
    },
    getBalances:(accs)=>{
      const narr=[];
      for(let i=0;i<accs.length;i++){
        narr.push(accs[i].address);
      }

      Account.balance(narr,(bs)=>{
        //console.log(bs);
        setBalances(bs);
      });
    },
    fresh: () => {
      Account.list({}, (data) => {
        setList(data);
        setTimeout(()=>{
          self.getBalances(data);
        },100);
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
              <th>Stamp</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={index}>
                <td>{row.network}</td>
                <td>
                  <span className="pointer"><FaCopy className={!recover[row.address] ? "" : recover[row.address]} onClick={(ev)=>{
                    self.clickCopy(row.address);
                    self.callRecover(row.address);
                  }}/></span>
                  <span className="ml-5">{tools.shorten(row.address)}</span>
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
                <td>{!balances[row.address]?0:balances[row.address].toLocaleString()}</td>
                <td>{self.getDate(row.stamp)}</td>
                <td>
                  <span className="pointer" onClick={(ev)=>{
                    self.clickRemove(row.address);
                  }}><FaSkullCrossbones /></span>
                  <span className="pointer ml-5"><FaFileDownload /></span>
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