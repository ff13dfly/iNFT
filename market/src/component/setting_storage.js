import { Row, Col, Form, Table } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaRegCopy, FaCopy, FaFileDownload, FaSkullCrossbones,FaSync,FaPizzaSlice } from "react-icons/fa";

function SettingStorage(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [encry, setEncry] = useState(true);


  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>iNFT Local Storage Setting</h5>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable password to encry localstoraget.
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
      </Col>

      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        Template List
      </Col>
      <Col className='text-end' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        More information here / adding functions
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CID</th>
              <th>Orgin</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className='pointer'><FaRegCopy /></span>
                <span className='ml-5'>bafkreihqa5j6llqfwm6bph343g325njntgvtov6v7iydx3l27i4vxuth2y</span>
              </td>
              <td>web3.storage</td>
              <td>
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
                <span className='pointer ml-5'><FaPizzaSlice /></span>
                <span className='pointer ml-5'><FaSync /></span>
              </td>
            </tr>
            <tr>
              <td>
                <span className='pointer'><FaCopy /></span>
                <span className='ml-5'>bafkreiclkjvs77vfggnuwwhhlwblpyssshrtwhvl3ibgzvhcvihcm7cidm</span>
              </td>
              <td>web3.storage</td>
              <td>
                <span className='pointer'><FaSkullCrossbones /></span>
                <span className='pointer ml-5'><FaFileDownload /></span>
                <span className='pointer ml-5'><FaPizzaSlice /></span>
                <span className='pointer ml-5'><FaSync /></span>
              </td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
export default SettingStorage;