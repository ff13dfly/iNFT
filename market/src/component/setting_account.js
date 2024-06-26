import { Row, Col, Form, Table } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaRegCopy, FaCopy, FaFileDownload, FaSkullCrossbones } from "react-icons/fa";

function SettingAccount(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [single, setSingle] = useState(true);

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>iNFT Accounts Setting</h5>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable single password to access all accounts.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Single Password"
            checked={single}
            onChange={(ev) => {
              setSingle(!single);
            }}
          />
        </Form>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        Account List
      </Col>
      <Col className='text-end' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        More information here / adding functions
      </Col>
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
export default SettingAccount;