import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import ImageOrgin from "./image_orgin";

import PartsList from "./parts_list";

import TemplateRaw from "./template_raw";

import PartsOverview from "./parts_overview";

/* Component Sample
*   @param  {string}    name        //unique name to load data from local indexedDB
*/

function CreativitySingle(props) {
  const size = {
    row: [12],
    head:[9,3],
    parts:[4,4,4],
    left:[9,3]
  };

  const self = {
  }

  useEffect(() => {

  }, []);

  return (
    <Tabs
      defaultActiveKey="image"
      id="uncontrolled-tab-example"
      className="mb-3"
      fill
      onSelect={(active) => {

      }}>
      <Tab eventKey="image" title={<h6>Image Editor</h6>}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]} >
            <PartsList />
            <ImageOrgin />
          </Col>
          <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]} >
            Select Parts Overview
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="parts" title={<h6>Gene Parts</h6>}>
        <Row>
          <Col md={size.parts[0]} lg={size.parts[0]} xl={size.parts[0]} xxl={size.parts[0]} >
            <PartsOverview />
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="series" title={<h6>Scarcity Series</h6>}>
        Series Selection
      </Tab>
      <Tab eventKey="raw" title={<h6>Raw JSON</h6>}>
        <TemplateRaw />
      </Tab>
    </Tabs>
  );
}
export default CreativitySingle;