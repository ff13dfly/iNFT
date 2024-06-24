import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

function SettingStorage(props) {
  const size = {
    row: [12],
  };

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>iNFT Local Storage Setting</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        
      </Col>
    </Row>
  );
}
export default SettingStorage;