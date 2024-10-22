import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import SeriesSelector from "./series_selector";

import GENE from "../../system/gene";

import { FaChevronUp, FaChevronDown, FaRegTrashAlt, FaFileMedical } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function SeriesOverview(props) {
  const size = {
    row: [12],
    half: [6],
    head: [9, 3],
    grid: [2, 6, 4]
  };

  let [info, setInfo] = useState("");
  let [list, setList] = useState([]);               //series list
  let [active, setActive] = useState(0);            //active series
  let [disable, setDisable] = useState(false);      //series add/remove button disable
  let [expand, setExpand] = useState(true);         //wether expand basic setting

  let [title, setTitle] = useState("");     //series title
  let [desc, setDesc] = useState("");       //series description


  const self = {
    changeTitle: (ev) => {
      setTitle(ev.target.value);

      list[active].name=ev.target.value;
      GENE.update.series(props.name,list,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    changeDesc: (ev) => {
      setDesc(ev.target.value);

      list[active].desc=ev.target.value;
      GENE.update.series(props.name,list,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    clickSingle: (index) => {
      setActive(index);
      self.fresh(index);
    },
    clickExpand: () => {
      setExpand(!expand);
    },
    clickRemove: (index) => {

    },
    clickAdd: (ck) => {
      const row = GENE.format("series");
      row.name = "Unset";
      row.desc = "Add more description here.";
      list.push(row);
      GENE.update.series(props.name, list, () => {
        self.fresh();
        return ck && ck();
      });
    },
    warning: (txt, at) => {
      setInfo(txt);
      if (at !== undefined) {
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
    fresh: (order) => {
      GENE.get(props.name, (dt) => {
        if (dt.error) return self.warning(dt.error);
        if (!dt.parts) return self.warning("Invalid Gene data format");
        setList(dt.series);

        if(order===undefined){
          if(!dt.series[active]) return self.warning("Invalid selected series.");
          const target=dt.series[active];
          setTitle(target.name);
          setDesc(target.desc);
        }else{
          if(!dt.series[order]) return self.warning("Invalid selected series.");
          const target=dt.series[order];
          setTitle(target.name);
          setDesc(target.desc);
        }
      });
    }
  }

  useEffect(() => {
    self.fresh();
  }, [props.name,props.update]);

  return (
    <Row>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col className="parts_border" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Row>
          {list.map((row, index) => (
            <Col key={index} className="text-center pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <button style={{width:"100%"}} className={active === index ? "btn btn-md btn-warning" : "btn btn-md btn-default"} onClick={(ev) => {
                self.clickSingle(index);
              }}>#{index}:{row.name}</button>
            </Col>
          ))}
          <Col className="text-center" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          <Col className="" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-danger" disabled={disable || list.length === 0} onClick={(ev) => {
              setDisable(true);
              self.clickRemove(() => {
                setDisable(false);
              });
            }}><FaRegTrashAlt /></button>
          </Col>
          <Col className="text-end" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev) => {
              setDisable(true);
              self.clickAdd(() => {
                setDisable(false);
              });
            }}><FaFileMedical /></button>
          </Col>
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
            <input type="text" className="form-control" 
              value={title}
              placeholder="The title for rarity series."
              onChange={(ev) => {
                self.changeTitle(ev);
              }} />
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>Series description</small>
            <textarea className="form-control" rows={5} 
              value={desc}
              placeholder="Details description for the rarity series."
              onChange={(ev) => {
                self.changeDesc(ev);
              }}></textarea>
          </Col>
        </Row>

        <Row>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <SeriesSelector name={props.name} index={active} fresh={props.fresh} update={props.update}/>
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