import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CommonNumber from "../common/common_number";
import GENE from "../../system/gene";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

/* Gene parts parameters
*   @param  {string}    props.name        //gene template name
*   @param  {number}    props.index       //parts index
*/

function PartsDetail(props) {
  const size = {
    row: [12],
    head: [9, 3],
    half: [6],
    input:[3,6,3],
  };

  let [info, setInfo] = useState("");       //information of warning
  let [disable, setDisable] =useState(true);    //disable all input
  let [hidden, setHidden] =useState(false);     //hidden all inputs

  let [value, setValue]=useState([0,0,0,0]);
  let [image, setImage]=useState([0,0,0,0]);
  let [position, setPosition]=useState([0,0]);
  let [rotation, setRotation]=useState([0]);
  let [center, setCenter]=useState([0,0]);
  let [rarity, setRarity]=useState([]);

  let [expandHash, setExpandHash] = useState(true);
  let [expandImage, setExpandImage] = useState(true);

  const self = {
    clickExpandImage: (ev) => {
      setExpandImage(!expandImage);
    },
    clickExpandHash: (ev) => {
      setExpandHash(!expandHash);
    },
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
    fresh:()=>{
      setInfo("");
      setDisable(true);
      setHidden(false);
      GENE.get(props.name, (dt) => {
        if (dt.error){
          setHidden(true);
          return self.warning(dt.error);
        } 
        if(!dt.parts || !dt.parts[props.index]){
          setHidden(true);
          return self.warning("Invalid Gene data format");
        } 
        const target=dt.parts[props.index];
        setValue(target.value);
        setImage(target.img);
        setPosition(target.position);
        setRotation(target.rotation);
        setCenter(target.center);
        setRarity(target.rarity);
        setDisable(false);
      });
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
        });
      });
    },
  }

  useEffect(() => {
    self.fresh();
  }, [props.name,props.index]);

  return (
    <Row>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col hidden={hidden} className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
            <h5>Hash Setting</h5>
          </Col>
          <Col className="pt-2 text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
            <button className="btn btn-sm btn-default" onClick={(ev) => {
              self.clickExpandHash()
            }}>
              {expandHash ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </Col>
        </Row>
        <Row hidden={!expandHash}>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={value[0]} disable={disable}  title={"Start of hash to cut"} callback={(val)=>{
              self.updatePart("value",0,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={value[1]} disable={disable}  title={"Step after start to cut"} callback={(val)=>{
              self.updatePart("value",1,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={value[2]} disable={disable}  title={"Options to select image part"} callback={(val)=>{
              self.updatePart("value",2,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={value[3]} disable={disable}  title={"Offset of gene template"} callback={(val)=>{
              self.updatePart("value",3,val);
            }}/>
          </Col>
        </Row>
        
        <Row>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
        </Row>
        
        <Row>
          <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
            <h5>Image Setting</h5>
          </Col>
          <Col className="pt-2 text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
            <button className="btn btn-sm btn-default" onClick={(ev) => {
              self.clickExpandImage()
            }}>
              {expandImage ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </Col>
        </Row>

        <Row hidden={!expandImage}>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <strong>Image cut parameters.</strong>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={image[0]} disable={disable}  title={"Start row to cut image"} callback={(val)=>{
              self.updatePart("img",0,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={image[1]} disable={disable}  title={"Start line to cut image"} callback={(val)=>{
              self.updatePart("img",1,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={image[2]} disable={disable}  title={"Cell X extend"} callback={(val)=>{
              self.updatePart("img",2,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={image[3]} disable={disable}  title={"Cell Y extend"} callback={(val)=>{
              self.updatePart("img",3,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={center[0]} disable={disable}  title={"Image center X"} callback={(val)=>{
              self.updatePart("center",0,val);
            }}/>
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={center[1]} disable={disable}  title={"Image center Y"} callback={(val)=>{
              self.updatePart("center",1,val);
            }}/>
          </Col>
          
          <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <strong>Image combining parameters.</strong>
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={position[0]} disable={disable}  title={"Part position X on iNFT"} callback={(val)=>{
              self.updatePart("position",0,val);
            }}/>
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={position[1]} disable={disable}  title={"Part position Y on iNFT"} callback={(val)=>{
              self.updatePart("position",1,val);
            }}/>
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <CommonNumber value={rotation[0]} disable={disable} title={"Part rotation on iNFT"} callback={(val)=>{
              self.updatePart("rotation",0,val);
            }}/>    
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default PartsDetail;