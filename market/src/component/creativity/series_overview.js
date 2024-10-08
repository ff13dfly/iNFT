import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import SeriesSelector from "./series_selector";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function SeriesOverview(props) {
  const size = {
    row: [12],
    head: [9, 3],
    grid:[2,6,4]
  };

  let [list, setList] = useState([]);
  let [active, setActive]= useState(0);

  let [expand, setExpand]=useState(true);

  let [title, setTitle]=useState("");
  let [desc, setDesc]=useState("");

  const self = {
    changeTitle:(ev)=>{
      setTitle(ev.target.value);
    },
    changeDesc:(ev)=>{
      setDesc(ev.target.value);
    },
    clickSingle:(index)=>{
      setActive(index);
    },
    clickExpand:()=>{
      setExpand(!expand);
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
            <button className="btn btn-md btn-primary">+  New Series</button>
          </Col>
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          {list.map((row, index) => (
            <Col key={index} className="text-center pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button className={active===index?"btn btn-md btn-warning":"btn btn-md btn-default"} onClick={(ev)=>{
                self.clickSingle(index);
              }}>#{index} - Title</button>
            </Col>
          ))}
        </Row>
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <Row>
          <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
            <h5>Series basic setting</h5>
          </Col>
          <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
            <button className="btn btn-sm btn-default" onClick={(ev) => {
              self.clickExpand()
            }}>
              {expand ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </Col>
        </Row>
        <Row hidden={!expand} className="pt-1">
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Series title</small>
            <input type="text" className="form-control" value={title} 
              placeholder="The title for rarity series."
              onChange={(ev)=>{
                self.changeTitle(ev);
              }}/>
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Series description</small>
            <textarea className="form-control" rows={5}  value={desc} 
              placeholder="Details description for the rarity series."
              onChange={(ev)=>{
                self.changeDesc(ev);
              }}></textarea>
          </Col>
        </Row>
        <Row>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <SeriesSelector name={props.name}/>
          </Col>
        </Row>
      </Col>
      <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
          Series Thumb List.
      </Col>
    </Row>
  );
}
export default SeriesOverview;