import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import ImageOrgin from "./image_orgin";
import ImageOperation from "./image_operation";

import PartsList from "./parts_list";


import TemplateRaw from "./template_raw";

import PartsOverview from "./parts_overview";
import SeriesOverview from "./series_overview";

import { FaImage,FaCode,FaPuzzlePiece,FaBraille } from "react-icons/fa";

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

  let [active,setActive]=useState("image");

  const tabs={
    image:{
      title:"Image Editor",
      icon:<FaImage size={24} className="mr-10" />,
    },
    parts:{
      title:"Gene Parts",
      icon:<FaPuzzlePiece size={24} className="mr-10" />,
    },
    series:{
      title:"Scarcity Series",
      icon:<FaBraille size={24} className="mr-10" />,
    },
    raw:{
      title:"Raw JSON",
      icon:<FaCode size={24} className="mr-10" />,
    },
  }

  const self = {
    getTitle:(tab)=>{
      if(!tabs[tab]) return "";
      const target=tabs[tab];
      return (
        <h6 className={active===tab?"text-dark":"text-secondary"}>
          {target.icon} {target.title}
        </h6>)
    },
  }

  useEffect(() => {
    console.log(props);
  }, [props.name]);

  return (
    <Tabs
      defaultActiveKey="image"
      id="uncontrolled-tab-example"
      className="mb-3 pt-2"
      fill
      onSelect={(tab) => {
        setActive(tab);
      }}>
      <Tab eventKey="image" title={self.getTitle("image")}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]} >
            <ImageOperation name={props.name}/>
            <ImageOrgin name={props.name}/>
          </Col>
          <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]} >
            <PartsList name={props.name}/>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="parts" title={self.getTitle("parts")}>
        <PartsOverview name={props.name}/>
      </Tab>
      <Tab eventKey="series" title={self.getTitle("series")}>
        <SeriesOverview name={props.name}/>
      </Tab>
      <Tab eventKey="raw" title={self.getTitle("raw")}>
        <TemplateRaw name={props.name}/>
      </Tab>
    </Tabs>
  );
}
export default CreativitySingle;