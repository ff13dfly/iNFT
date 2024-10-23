import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CommonNumber from "../common/common_number";
import GENE from "../../system/gene";

/* Component Sample
*   @param  {string}    props.name        //unique name to load data from local indexedDB
*   @param  {number}    props.update      //force update count
*/

function TemplateBasic(props) {
  const size = {
    row: [12],
    right: [2, 10],
    input: [2, 5, 5],
    layout: [9, 3],
  };

  let [info, setInfo]=useState("");
  let [desc, setDesc] = useState("");
  let [title, setTitle] = useState("");

  let [image, setImage]=useState([900,900]);
  let [grid, setGrid]=useState([8,4]);
  let [cell, setCell]=useState([100,100]);

  const self = {
    changeTitle: (ev) => {
      const ctx=ev.target.value;
      setTitle(ctx);
      GENE.update.title(props.name,ctx,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    changeDesc: (ev) => {
      const ctx=ev.target.value;
      setDesc(ctx);
      GENE.update.desc(props.name,ctx,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    warning:(txt,at)=>{
      setInfo(txt);
      if(at!==undefined){
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
    updateData:(cat,arr)=>{
      if(!GENE.update[cat]) return self.warning("Unexcepted update.");
      GENE.update[cat](props.name,arr[0],arr[1],(res)=>{
        if(res.error) return self.warning(res.error);
        self.fresh();
      });
    },
    fresh:()=>{
      GENE.get(props.name, (dt) => {
        if (dt.error) return false;
        setImage(dt.size);
        setGrid(dt.grid);
        setCell(dt.cell);
        setTitle(dt.title);
        setDesc(dt.desc)
      });
    }
  }

  useEffect(() => {
    self.fresh();
  }, [props.name,props.update]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {info}
      </Col>
      <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
        <Row>
          <Col md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
            <h5>iNFT Size</h5>
          </Col>
          <Col md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
            <CommonNumber value={image[0]} title={"iNFT Width"} callback={(val) => {
              self.updateData("size",[val,image[1]]);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
            <CommonNumber value={image[0]} title={"iNFT Height"} callback={(val) => {
              self.updateData("size",[image[0],val]);
            }} />
          </Col>
        </Row>

        <Row>
          <Col md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
            <h5>Cell Size</h5>
          </Col>
          <Col md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
            <CommonNumber value={cell[0]} title={"Cell Width"} step={10} callback={(val) => {
              self.updateData("cell",[val,cell[1]]);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
            <CommonNumber value={cell[1]} title={"Cell Height"} step={10} callback={(val) => {
              self.updateData("cell",[cell[0],val]);
            }} />
          </Col>
        </Row>

        <Row>
          <Col md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
            <h5>Grid Setting</h5>
          </Col>
          <Col md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
            <CommonNumber value={grid[0]} title={"Lines"} callback={(val) => {
              self.updateData("grid",[val,grid[1]]);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
            <CommonNumber value={grid[1]} title={"Rows"} callback={(val) => {
              self.updateData("grid",[grid[0],val]);
            }} />
          </Col>
        </Row>

        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
            <h5>Description</h5>
          </Col>
          <Col md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
            <small>Gene title</small>
            <input type="text" className="form-control" value={title} onChange={(ev) => {
              self.changeTitle(ev);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
          </Col>

          <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>

          </Col>
          <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
            <small>Gene description</small>
            <textarea className="form-control" rows={8} value={desc} onChange={(ev) => {
              self.changeDesc(ev);
            }} ></textarea>
          </Col>
        </Row>

      </Col>
      <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <h5>iNFT Introduction</h5>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default TemplateBasic;