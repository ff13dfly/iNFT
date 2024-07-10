import { Table } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { FaSkullCrossbones, FaSync,FaFileDownload } from "react-icons/fa";

import tools from "../lib/tools";
import INDEXED from '../lib/indexed';

import Config from '../system/config';

function StorageINFT(props) {
  const size = {
    row: [12]
  };

  let [list, setList] = useState([]);

  const nameDB =Config.get(["storage","DBname"]);
  const table = "infts";

  const self={
    clickRemove:(name)=>{
      console.log(name);
      INDEXED.checkDB(nameDB, (db) => {
        if (INDEXED.checkTable(db.objectStoreNames, table)) {
          INDEXED.removeRow(db,table,"name",name,(done)=>{
            if(done) self.fresh();
          });
        }
      });
    },
    clickFresh:(name)=>{
      console.log(name);
    },
    getDate:(stamp)=>{
      return tools.day(stamp,"-");
    },
    fresh:()=>{
      INDEXED.checkDB(nameDB, (db) => {
        if (INDEXED.checkTable(db.objectStoreNames, table)) {
          INDEXED.pageRows(db, table, (res) => {
            if (res !== false) {
              setList(res);
            }
          });
        }
      });
    },
  };

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>iNFT</th>
          <th>Last</th>
          <th>Share</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {list.map((row, index) => (
          <tr key={index}>
            <td>
              <span className='ml-5'> <img className='template_icon' src={row.thumb} alt="template thumb" /></span>
              <span className='ml-5'>{row.name}</span>
            </td>
            <td>{self.getDate(row.stamp)}</td>
            <td>
            <span className='pointer' onClick={(ev)=>{
                  self.clickDownload(row.name);
              }}><FaFileDownload /></span>
            </td>
            <td>
              <span className='pointer' onClick={(ev)=>{
                  self.clickRemove(row.name);
              }}><FaSkullCrossbones /></span>
              
              <span className='pointer ml-5' onClick={(ev)=>{
                  self.clickFresh(row.name);
              }}><FaSync /></span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default StorageINFT;