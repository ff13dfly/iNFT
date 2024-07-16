import { Row,Col, Table,Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Config from "../system/config"

function ProxyMarket(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [list, setList] = useState([]);

  const self = {
    fresh: () => {
      const arr = Config.get(["proxy","nodes","market"]);
      console.log(arr);
      setList(arr);
    },
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Table striped bordered hover>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Language</th>
              <th>Deifinition</th>
              <th>Orgin</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={index}>
                <td>{row.protocol}{row.domain}</td>
                <td>{row.lang}</td>
                <td>{row.def}</td>
                <td>{row.orgin}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
  );
}
export default ProxyMarket;