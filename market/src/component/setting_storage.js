import { Row, Col, Form, Table } from 'react-bootstrap';
import { useEffect, useState } from "react";

import StorageTemplat from './storage_template';
import StorageINFT from './storage_inft';
import INDEXED from '../lib/indexed';

function SettingStorage(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [encry, setEncry] = useState(true);
  let [tpls, setTpls] =useState([]);

  useEffect(() => {
    const nameDB="inftDB";
    const table="template";
    INDEXED.checkDB(nameDB, (db) => {
      //console.log(db);
      if(INDEXED.checkTable(db.objectStoreNames,table)){
        INDEXED.pageRows(db,table,(res)=>{
          if(res!==false){
            setTpls(res);
          }
        });
      }
    });

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>iNFT Local Storage Setting</h5>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      {/* <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable password to encry cache which is stored in indexedDB.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            label="Encried Storage"
            checked={encry}
            onChange={(ev) => {
              setEncry(!encry);
            }}
          />
        </Form>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col> */}

      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        Template List
      </Col>
      <Col className='text-end' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        More information here / adding functions
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <StorageTemplat />
      </Col>

      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        iNFT Result List
      </Col>
      <Col className='text-end' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        More information here / adding functions
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <StorageINFT />
      </Col>
    </Row>
  );
}
export default SettingStorage;