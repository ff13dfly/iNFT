import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import SVGGrid from "./svg_grid";

function BasicINFT(props) {
  const size = {
    row: [12],
    grid: [4],
    schema:[2,8,2],
  };

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
            <Col md={size.schema[0]} lg={size.schema[0]} xl={size.schema[0]} xxl={size.schema[0]}>
              <span>500</span>
            </Col>
            <Col md={size.schema[1]} lg={size.schema[1]} xl={size.schema[1]} xxl={size.schema[1]}>
              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="100" height="100" fill="#e3f3ab" stroke="black" strokeWidth="1" />
                <rect x="25" y="25" width="50" height="50" fill="#fff3ab" stroke="black" strokeWidth="1" />
              </svg>
            </Col>
            <Col md={size.schema[2]} lg={size.schema[2]} xl={size.schema[2]} xxl={size.schema[2]}>

            </Col>
            <Col md={size.schema[0]} lg={size.schema[0]} xl={size.schema[0]} xxl={size.schema[0]}>
            </Col>
            <Col className="text-center" md={size.schema[1]} lg={size.schema[1]} xl={size.schema[1]} xxl={size.schema[1]}>
              <span>500</span>
            </Col>
            <Col md={size.schema[2]} lg={size.schema[2]} xl={size.schema[2]} xxl={size.schema[2]}>

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
            <Col md={size.schema[0]} lg={size.schema[0]} xl={size.schema[0]} xxl={size.schema[0]}>
              <span>500</span>
            </Col>
            <Col md={size.schema[1]} lg={size.schema[1]} xl={size.schema[1]} xxl={size.schema[1]}>
              <SVGGrid x={4} y={3} width={30} background={"#e3f3ab"}/>
            </Col>
            <Col md={size.schema[2]} lg={size.schema[2]} xl={size.schema[2]} xxl={size.schema[2]}>

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