import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CreativitySingle from "./creativity_single";

import GENE from "../../system/gene";
import tools from "../../lib/tools";

import { FaDna,FaRegTrashAlt,FaFileMedical } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*   @param  {string}    active      //active gene template
*   @param  {function}  show          // set content to show on entry creativity.js
*   @param  {function}  [fresh]         // show the title content
*   @param  {function}  [fullscreen]  //get the fullscreen status
*/

function TemplateList(props) {
  const size = {
    row: [12],
    half:[6]
  };

  let [list, setList] = useState([]);
  let [active, setActive]= useState(999);
  let [name, setName]= useState("");

  const self = {
    clickGene: (index,name,stamp) => {
      setActive(index);
      setName(name);

      //1.shwo gene 
      if (props.show) props.show(<CreativitySingle name={name} fullscreen={props.fullscreen}/>);

      //2. fresh entry page title
      if(props.fresh) props.fresh(<Row>
        <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Selected gene template: <strong>{name}</strong>, created on <strong>{tools.day(stamp,"-")}</strong>
        </Col>
      </Row>);

      //3. set the active gene template in lib
      //GENE.active(name);
    },
    clickAdd:(ev)=>{
      GENE.add(()=>{
        self.fresh();
      });
    },
    clickRemove:(ev)=>{
      if(!name) return ;
      GENE.remove(name,(res)=>{
        setActive(0);
        self.fresh();
      });
    },
    fresh:()=>{
      GENE.list((arr)=>{
        setList(arr);
      })
    },
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Row>
      {list.map((row, index) => (
        <Col key={index} className="pointer" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <button 
            className={index===active?"btn btn-md btn-warning":"btn btn-md btn-default"} 
            style={{width:"100%"}}
            onClick={(ev) => {
              self.clickGene(index,row.name,row.stamp);
            }}><FaDna size={16}/><span className="ml-5 pt-2">Gene: {row.name}</span></button>
        </Col>
      ))}
      <Col className="pt-4" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <button className="btn btn-md btn-danger" onClick={(ev)=>{
          self.clickRemove(ev);
        }}><FaRegTrashAlt /></button>
      </Col>
      <Col className="text-end pt-4" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickAdd(ev);
        }}><FaFileMedical /></button>
      </Col>
    </Row>
  );
}
export default TemplateList;