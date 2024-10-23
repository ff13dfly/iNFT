import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CommonNumber from "../common/common_number";
import GENE from "../../system/gene";

/* Basic image parameters
*   @param  {string}    props.name        //unique name
*   @param  {number}    props.index       //index of parts
*/

function ImageParameter(props) {
  const size = {
    row: [12],
    amount: [3, 6, 3],
    half: [6],
  };

  let [info, setInfo] = useState("");       //information of warning
  let [value, setValue]=useState([0,0,0,0]);
  let [image, setImage]=useState([0,0,0,0]);
  let [position, setPosition]=useState([0,0]);
  let [rotation, setRotation]=useState([0]);
  let [center, setCenter]=useState([0,0]);
  let [rarity, setRarity]=useState([]);

  const self = {
    warning:(txt,at)=>{
      setInfo(txt);
      if(at!==undefined){
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
    getPart:()=>{
      return {
        value:value,
        img:image,
        center:center,
        position:position,
        rotation:rotation,
        rarity:rarity,
      }
  },
    updatePart:(key,pos,val)=>{
      const part=self.getPart();
      if(!part[key] || part[key][pos]===undefined) return false;
      part[key][pos]=val;

      GENE.get(props.name, (dt) => {
        if (dt.error) return false;
        const parts=dt.parts;
        parts[props.index]=part;
        GENE.update.parts(props.name,parts,(res)=>{
          if(res.error) return self.warning(res.error);

          if(props.fresh) props.fresh();
        });
      });
    },
  }

  useEffect(() => {
    GENE.get(props.name, (dt) => {
      if (dt.error){
        return self.warning(dt.error);
      } 
      if(!dt.parts || !dt.parts[props.index]){
        return self.warning("Invalid Gene data format");
      } 
      const target=dt.parts[props.index];
      setValue(target.value);
      setImage(target.img);
      setPosition(target.position);
      setRotation(target.rotation);
      setCenter(target.center);
      setRarity(target.rarity);
    });
  }, [props.name, props.index,props.update]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Part Image Selection</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={image[0]} title={"Start Line"} callback={(val) => {
          self.updatePart("img",0,val);
        }} />
      </Col>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={image[1]} title={"Start Row"} callback={(val) => {
          self.updatePart("img",1,val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={value[2]} title={"Part Options"} callback={(val) => {
          self.updatePart("value",2,val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={image[2]} title={"Part X Extend"} callback={(val) => {
          self.updatePart("img",2,val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={image[3]} title={"Part Y Extend"} callback={(val) => {
          self.updatePart("img",3,val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={value[3]} title={"Offset"} callback={(val) => {
          self.updatePart("value",3,val);
        }} />
      </Col>
    </Row>
  );
}
export default ImageParameter;