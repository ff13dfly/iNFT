import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaRegCopy, FaCopy, FaFileDownload, FaSkullCrossbones, FaSync, FaPizzaSlice } from "react-icons/fa";

import INDEXED from "../lib/indexed";
import Config from "../system/config";

function StorageTemplat(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const nameDB =Config.get(["storage","DBname"]);
  const table = "template";

  const self={
    clickRemove:(cid)=>{
      INDEXED.checkDB(nameDB, (db) => {
        if (INDEXED.checkTable(db.objectStoreNames, table)) {
          INDEXED.removeRow(db,table,"cid",cid,(done)=>{
            if(done) self.fresh();
          });
        }
      });
    },

    clickPlayground:(cid)=>{

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
  }  
  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>CID</th>
          <th>Orgin</th>
          <th>Share</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {list.map((row, index) => (
          <tr key={index}>
            <td>
              <span className="ml-5"> <img className="template_icon" src={row.thumb} alt="template thumb" /></span>
              <span className="ml-5">{row.cid}</span>
            </td>
            <td>web3.storage</td>
            <td>
              <span className="pointer ml-5"><FaFileDownload /></span>
            </td>
            <td>
              <span className="pointer" onClick={(ev)=>{
                self.clickRemove(row.cid);
              }}><FaSkullCrossbones /></span>
              <span className="pointer ml-5"><FaPizzaSlice /></span>
              <span className="pointer ml-5"><FaSync /></span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default StorageTemplat;