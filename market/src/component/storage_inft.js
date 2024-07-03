import { Table } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { FaSkullCrossbones, FaSync } from "react-icons/fa";

import tools from "../lib/tools";
import INDEXED from '../lib/indexed';

function StorageINFT(props) {
  const size = {
    row: [12],
    grid: [3]
  };

  let [list, setList] = useState([]);

  const self={
    getDate:(stamp)=>{
      return tools.day(stamp,"-");
    },
  };

  useEffect(() => {
    const nameDB = "inftDB";
    const table = "infts";
    INDEXED.checkDB(nameDB, (db) => {
      if (INDEXED.checkTable(db.objectStoreNames, table)) {
        INDEXED.pageRows(db, table, (res) => {
          if (res !== false) {
            setList(res);
          }
        });
      }
    });
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>iNFT</th>
          <th>Last</th>
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
              <span className='pointer'><FaSkullCrossbones /></span>
              <span className='pointer ml-5'><FaSync /></span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default StorageINFT;