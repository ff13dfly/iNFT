import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import PartsDetail from "./parts_detail";

import GENE from "../../system/gene";
import tools from "../../lib/tools";

import { FaArrowUp, FaArrowDown,FaRegTrashAlt,FaFileMedical } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsOverview(props) {
  const size = {
    row: [12],
    grid: [2, 6, 4],
    half: [6]
  };

  let [info, setInfo] = useState("");  
  let [list, setList] = useState([]);       //parts list
  let [active, setActive]= useState(0);     //the selected part
  let [disable, setDisable]= useState(false);   //disable add button

  const funs={
    
  };

  const self = {
    clickUp:()=>{

    },
    clickDown:()=>{

    },
    clickPart:(index)=>{
      setActive(index);
    },
    clickAdd:(ck)=>{
      const row=self.getPart();
      list.push(row);
      GENE.update.parts(props.name,list,()=>{
        self.fresh();
        return ck && ck();
      });
    },
    clickRemove:(ck)=>{
      const narr=[];
      for(let i=0;i<list.length;i++){
        if(i!==active) narr.push(list[i]);
      }

      GENE.update.parts(props.name,narr,()=>{
        self.fresh();
        return ck && ck();
      });
    },
    getPart:()=>{
      if(list.length===0) return GENE.format("part");
      const dt=tools.clone(!list[active]?list[list.length-1]:list[active]);
      dt.value[0]+=2;
      return dt;
    },  
    warning:(txt,at)=>{
      setInfo(txt);
      if(at!==undefined){
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
    fresh:()=>{
      GENE.get(props.name, (dt) => {
        if (dt.error) return self.warning(dt.error);
        if(!dt.parts) return self.warning("Invalid Gene data format");
        setList(dt.parts);
      });
    },
  }

  useEffect(() => {
    self.fresh();
  }, [props.name]);

  return (
    <Row  style={{paddingBottom:"100px"}}>
      <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col className="parts_border" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Row>
          <Col className="" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-danger" disabled={disable || list.length===0} onClick={(ev)=>{
              setDisable(true);
              self.clickRemove(()=>{
                setDisable(false);
              });
            }}><FaRegTrashAlt /></button>
          </Col>
          <Col className="text-end" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev)=>{
              setDisable(true);
              self.clickAdd(()=>{
                setDisable(false);
              });
            }}><FaFileMedical /></button>
          </Col>
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          {list.map((row, index) => (
            <Col className="text-center pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button className={active===index?"btn btn-md btn-warning":"btn btn-md btn-default"} onClick={(ev)=>{
                self.clickPart(index);
              }}>
                #{index} - {row.value[2]} options
              </button>
            </Col>
          ))}
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          <Col className=""  md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev) => {
              self.clickUp();
            }}><FaArrowUp /></button>
          </Col>
          <Col className="text-end" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev) => {
              self.clickUp();
            }}><FaArrowDown /></button>
          </Col>
        </Row>
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <PartsDetail name={props.name} index={active}/>
      </Col>
      <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        SVG value selection.<br />
        SVG Image position overview.
        Image selected parts.
      </Col>
    </Row>
  );
}
export default PartsOverview;