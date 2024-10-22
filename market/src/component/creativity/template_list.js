import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CreativitySingle from "./creativity_single";

import Gene from "../../system/gene";
import tools from "../../lib/tools";

import { FaDna } from "react-icons/fa";

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
  };

  let [list, setList] = useState([]);
  let [active, setActive]= useState(999);

  const self = {
    clickGene: (index,name,stamp) => {
      setActive(index);
      //1.show UI on entry page
      // if (props.show) props.show(<div>
      //   <CreativityBasic name={name} fullscreen={props.fullscreen}/>
      //   <CreativitySingle name={name} fullscreen={props.fullscreen}/>
      // </div>);
      if (props.show) props.show(<CreativitySingle name={name} fullscreen={props.fullscreen}/>);

      //2. fresh entry page title
      if(props.fresh) props.fresh(`Selected gene template: ${name}, created on ${tools.day(stamp,"-")}`);

      //3. set the active gene template in lib
      Gene.active(name);
    },
    clickAdd:(ev)=>{
      Gene.add(()=>{
        self.fresh();
      });
    },
    fresh:()=>{
      Gene.list((arr)=>{
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
            style={{width:"100$"}}
            onClick={(ev) => {
              self.clickGene(index,row.name,row.stamp);
            }}><FaDna size={16}/><span className="ml-5 pt-2">Gene: {row.name}</span></button>
        </Col>
      ))}
      <Col className="text-center pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickAdd(ev);
        }}>+ New Gene</button>
      </Col>
    </Row>
  );
}
export default TemplateList;