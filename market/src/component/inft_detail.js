import { Container,Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

function DetailINFT(props) {

  const size = {
    row: [12],
  };

  useEffect(() => {
}, [  ]);

  return (
      <Row className='pb-4'>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Price details
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Network: Tanssi Appchain
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Unique Name: 
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Block Hash: 
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Transaction Hash: 
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Block: 
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Owner: 
        </Col>
    </Row>
  );
}
export default DetailINFT;