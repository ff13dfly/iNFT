import { Row, Col, Table, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaRegCopy, FaCopy, FaFileDownload, FaSkullCrossbones } from "react-icons/fa";

import Config from "../system/config";
import tools from "../lib/tools";

function AccountList(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [list, setList]=useState([]);

  const self={
    fresh:()=>{
      console.log("force to fresh.");
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
            <tr>
              <td>Anchor</td>
              <td>
                <span className='pointer'><FaRegCopy /></span>
                <span className='ml-5'>5ECZb1Jmm8ACGXdXtBx9AbqspK2ECQ1QNnXqH9FiGLEEjJjV</span>
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
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
            <tr>
              <td>Polkadot</td>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw</span>
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
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>5DcpcBu1J4qpQRkeFy6Qcn9FxUm6knhvufnYpX62oHH1zWCx</span>
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
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
            <tr>
              <td>Solana</td>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw</span>
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
              <td>Phantom</td>
              <td>
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
            <tr>
              <td>Sui</td>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw</span>
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
              <td>Sui Wallet</td>
              <td>
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
            <tr>
              <td>APTOS</td>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>5CSTSUDaBdmET2n6ju9mmpEKwFVqaFtmB8YdB23GMYCJSgmw</span>
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
              <td>Petra</td>
              <td>
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
              </td>
            </tr>
          </tbody>


        </Table>
      </Col>

    </Row>
  );
}
export default AccountList;