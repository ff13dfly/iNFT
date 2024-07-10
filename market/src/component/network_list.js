import { Row,Col, Table,Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaRegCopy, FaCopy, FaLightbulb, FaSkullCrossbones,FaSync } from "react-icons/fa";

import Account from "../system/account";

import INDEXED from '../lib/indexed';
import Config from '../system/config';

function NetworkList(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [list, setList] = useState([]);

  const self = {
    getNetworks: (map) => {
      const arr = [];
      for (var k in map) {
        const row = map[k];
        row.network = k;
        arr.push(row);
      }
      return arr;
    },
    fresh: () => {
      const map = Config.get("network");
      const arr = self.getNetworks(map);
      console.log(arr);
      setList(arr);
    },
  }

  useEffect(() => {
    self.fresh();
  }, [props.update]);

  return (
    <Table striped bordered hover>
          <thead>
            <tr>
              <th>Network</th>
              <th>Asset</th>
              <th>Node</th>
              <th>Type</th>
              <th>Enable</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.network}
                </td>
                <td>
                  {row.coin}
                </td>
                <td>
                  <Row>
                  {row.nodes.map((uri, k) => (
                    <Col key={k} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                      <span><FaLightbulb color={"green"} /></span>
                      <span className='ml-5'>{uri}</span>
                    </Col>
                    ))}
                  </Row>
                  
                </td>
                <td>
                  Agent
                </td>
                <td>
                  <Form>
                    <Form.Check // prettier-ignore
                      type="switch"
                      checked={row.enable}
                      label=""
                      onChange={(ev) => {

                      }}
                    />
                  </Form>
                </td>
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
export default NetworkList;