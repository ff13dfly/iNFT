import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import PartsDetail from "./parts_detail";

import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PartsOverview(props) {
  const size = {
    row: [12],
    grid: [2, 6, 4],
    half: [6]
  };

  let [list, setList] = useState([]);       //parts list
  let [active, setActive]= useState(0);     //the selected part

  const self = {
    clickUp:()=>{

    },
    clickDown:()=>{

    },
    clickPart:(index)=>{
      setActive(index);
    },
  }

  useEffect(() => {
    const arr = [{ part: 1 }, { part: 2 }]
    setList(arr);
  }, []);

  return (
    <Row>
      <Col className="parts_border" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Row>
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <button className="btn btn-md btn-primary">+ New Part</button>
          </Col>
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          {list.map((row, index) => (
            <Col className="text-center pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button className={active===index?"btn btn-md btn-warning":"btn btn-md btn-default"} onClick={(ev)=>{
                self.clickPart(index);
              }}>
                #{index} - 8 options
              </button>
            </Col>
          ))}
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          <Col className="text-end"  md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" onClick={(ev) => {
              self.clickUp();
            }}><FaArrowUp /></button>
          </Col>
          <Col className="" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" onClick={(ev) => {
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