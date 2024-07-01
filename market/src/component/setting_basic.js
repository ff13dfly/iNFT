import { Row, Col, Form } from 'react-bootstrap';
import { useEffect,useState } from "react";

function SettingBasic(props) {
  const size = {
    row: [12],
    head: [4, 8],
    normal: [9, 3],
    left: [8, 4],
    right: [4, 8],
  };

  let [ cache, setCache]=useState(true);            //template cache
  let [ thumb, setThumb ]=useState(true);           //iNFT thumb cache
  let [ checking, setChecking ]=useState(true);
  let [ pass, setPass ]=useState(true);

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>iNFT System Basic Setting</h5>
        <small>iNFT Portal is the platform to manage the iNFT instance and template on multi networks.</small>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable setting password.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="System Password"
            checked={pass}
            onChange={(ev) => {
              setPass(!pass);
            }}
          />
        </Form>
      </Col>
      <Col hidden={!pass} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Password setting page
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable cache iNFT template data to local IndexDB.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Cache Template"
            checked={cache}
            onChange={(ev) => {
              setCache(!cache);
            }}
          />
        </Form>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Enable cache iNFT thumb data to local IndexDB.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Cache iNFT thumb"
            checked={thumb}
            onChange={(ev) => {
              setThumb(!thumb);
            }}
          />
        </Form>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        Checking system when iNFT system startup.
      </Col>
      <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="System Checking"
            checked={checking}
            onChange={(ev) => {
              setChecking(!checking);
            }}
          />
        </Form>
      </Col>
    </Row>
  );
}
export default SettingBasic;