import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

function BasicINFT(props) {
  const size = {
    row: [12],
    grid: [4],
  };

  let [data, setDate] =useState([]);

  const self={

  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <Row>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <strong>iNFT Size</strong>
            </Col>
          </Row>
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <Row>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <strong>Cell Size</strong>
            </Col>
          </Row>
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <Row>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <strong>Orginal Image Grid</strong>
            </Col>
          </Row>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Template basic parameters, raw: {JSON.stringify(props.data)}
      </Col>
    </Row>
  );
}
export default BasicINFT;