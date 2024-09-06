import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import ImageGrid from "./image_grid";
import PartSelector from "./parts_selector";

import { FaCopy, FaFileImage,FaTrashAlt,FaAngleLeft,FaAngleRight, FaDownload} from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function ImageOperation(props) {
  const size = {
    row: [12],
    opt:[3,4,5],
    parts:[1,11],
  };

  const self = {
  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.opt[0]} lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]}>
        {/* <span>Panel</span> */}
        <button className="btn btn-sm btn-default"><FaCopy size={20}/></button> 
        <button className="btn btn-sm btn-default"><FaFileImage size={20}/></button>
        <span className="ml-10 mr-5">|</span>
        <button className="btn btn-sm btn-default"><FaTrashAlt size={20}/></button>
      </Col>
      <Col  md={size.opt[1]} lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]}>
        <ImageGrid />
      </Col>
      <Col className="text-end" md={size.opt[2]} lg={size.opt[2]} xl={size.opt[2]} xxl={size.opt[2]}>
      
        <button className="btn btn-sm btn-default"><FaDownload size={20}/></button> 
        <span className="ml-10 mr-5">|</span>
        <button className="btn btn-sm btn-default"><FaAngleLeft size={20}/></button> 
        <button className="btn btn-sm btn-default"><FaAngleRight size={20}/></button>
      </Col>
      <Col className="pt-2" md={size.parts[0]} lg={size.parts[0]} xl={size.parts[0]} xxl={size.parts[0]}>
        <h6>Parts</h6>
      </Col>
      <Col className="pt-1" md={size.parts[1]} lg={size.parts[1]} xl={size.parts[1]} xxl={size.parts[1]}>
        <PartSelector amount={10} callback={(index)=>{

        }}/>
      </Col>
      
    </Row>
  );
}
export default ImageOperation;