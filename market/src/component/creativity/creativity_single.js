import { Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import TemplateBasic from "./temlpate_basic";
import TemplateRaw from "./template_raw";
import ImageOverview from "./image_overview";
import PartsOverview from "./parts_overview";
import SeriesOverview from "./series_overview";

import { FaImage,FaCogs,FaPuzzlePiece,FaBraille,FaCloudUploadAlt } from "react-icons/fa";

/* Component Sample
*   @param  {string}    props.name        //unique name to load data from local indexedDB
*/

function CreativitySingle(props) {
  const size = {
    row: [12],
  };

  let [active,setActive]=useState("image");
  let [update, setUpdate]=useState(0);

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
    basic:{
      title:"Basic Setting",
      icon:<FaCogs size={24} className="mr-10" />,
    },
    raw:{
      title:"IPFS Deployment",
      icon:<FaCloudUploadAlt size={24} className="mr-10" />,
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
    fresh:()=>{
      setUpdate(update+1);
    },
  }

  useEffect(() => {
    //console.log(props);
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
      <Tab eventKey="basic" title={self.getTitle("basic")}>
        <TemplateBasic name={props.name} fresh={self.fresh} update={update}/>
      </Tab>
      <Tab eventKey="image" title={self.getTitle("image")} >
        <ImageOverview name={props.name} fresh={self.fresh} update={update}/>
      </Tab>
      <Tab eventKey="parts" title={self.getTitle("parts")}>
        <PartsOverview name={props.name} fresh={self.fresh} update={update}/>
      </Tab>
      <Tab eventKey="series" title={self.getTitle("series")}>
        <SeriesOverview name={props.name} fresh={self.fresh} update={update}/>
      </Tab>
      <Tab eventKey="raw" title={self.getTitle("raw")}>
        <TemplateRaw name={props.name} fresh={self.fresh} update={update}/>
      </Tab>
    </Tabs>
  );
}
export default CreativitySingle;