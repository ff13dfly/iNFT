import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import ImageGrid from "./image_grid";

import GENE from "../../system/gene";
import tools from "../../lib/tools";

import { FaCopy,FaPaste, FaFileImage,FaTrashAlt,FaAngleLeft,FaAngleRight, FaDownload, FaFileDownload} from "react-icons/fa";

/* Image operation panel
*   @param  {string}    props.name        //unique nam
*/

function ImageOperation(props) {
  const size = {
    row: [12],
    opt:[3,4,5],
    parts:[1,11],
  };

  const btns={
    copy:false,
    paste:false,
    upload:true,
    trash:true,
    image:false,
    download:true,
  };
  let [enable, setEnable]= useState(btns);

  const self = {
    clickDownloadImage:(ev)=>{
      self.getGeneData(props.name,(dt)=>{
        tools.download("full.png",dt.image,"image");
      });
    },
    getGeneData:(name,ck)=>{
      GENE.get(name, ck);
    },
    fresh:()=>{
      self.getGeneData(props.name,(dt)=>{
        if (dt.error) return false;
        if(dt.image){
          enable.image=true;
          setEnable(tools.clone(enable));
        }
      });
    },
  }

  useEffect(() => {
    //console.log(props);
    self.fresh();
  }, [props.name, props.index,props.order,props.update]);
  return (
    <Row>
      <Col md={size.opt[0]} lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]}>
        {/* <span>Panel</span> */}
        <button className="btn btn-sm btn-default" disabled={!enable.copy} onClick={()=>{

        }}>
          <FaCopy size={20}/>
        </button> 
        <button className="btn btn-sm btn-default" disabled={!enable.paste} onClick={()=>{

        }}>
          <FaPaste size={20}/>
        </button> 
        <span className="ml-10 mr-5">|</span>
        <button className="btn btn-sm btn-default" disabled={!enable.upload} onClick={()=>{
          
        }}>
          <FaFileImage size={20}/>
        </button>
        <button className="btn btn-sm btn-default" disabled={!enable.trash} onClick={()=>{
          
        }}>
          <FaTrashAlt size={20}/>
        </button>

        
      </Col>
      <Col  md={size.opt[1]} lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]}>
        <ImageGrid />
      </Col>
      <Col className="text-end" md={size.opt[2]} lg={size.opt[2]} xl={size.opt[2]} xxl={size.opt[2]}>
        <button className="btn btn-sm btn-default" disabled={!enable.image} onClick={(ev)=>{
          self.clickDownloadImage(ev);
        }}>
          <FaFileDownload size={20}/>
        </button>
        <button className="btn btn-sm btn-default" disabled={!enable.download} onClick={()=>{
          
        }}><FaDownload size={20}/></button> 
        <span className="ml-10 mr-5">|</span>
        <button className="btn btn-sm btn-default" onClick={()=>{
          
        }}><FaAngleLeft size={20}/></button> 
        <button className="btn btn-sm btn-default"onClick={()=>{
          
        }}><FaAngleRight size={20}/></button>
      </Col>
    </Row>
  );
}
export default ImageOperation;