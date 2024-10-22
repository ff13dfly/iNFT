import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import GENE from "../../system/gene";

/* Component Sample
*   @param  {string}    name        //unique name to load data from local indexedDB
*/

function TemplateBasic(props) {
  const size = {
    row: [12],
    right: [2, 10],
    input: [2, 5, 5],
    layout: [9, 3],
  };

  let [info, setInfo]=useState("");
  let [width, setWidth] = useState(900);
  let [height, setHeigth] = useState(900);
  let [cellX, setCellX] = useState(100);
  let [cellY, setCellY] = useState(100);
  let [desc, setDesc] = useState("");
  let [title, setTitle] = useState("");

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
    changeWidth: (ev) => {
      const w=parseInt(ev.target.value);
      setWidth(w);
      GENE.update.size(props.name,w,height,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    changeHeight: (ev) => {
      const h=parseInt(ev.target.value);
      setHeigth(h);
      GENE.update.size(props.name,width,h,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    changeCellX: (ev) => {
      const x=parseInt(ev.target.value);
      setCellX(x);
      GENE.update.cell(props.name,x,cellY,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },
    changeCellY: (ev) => {
      const y=parseInt(ev.target.value);
      setCellY(y);
      GENE.update.cell(props.name,cellX,y,(res)=>{
        if(res.error) return self.warning(res.error);
      });
    },

    updateData: (data) => {
      setWidth(data.size[0]);
      setHeigth(data.size[1]);

      setCellX(data.cell[0]);
      setCellY(data.cell[1]);

      setTitle(!data.title?"":data.title);
      setDesc(!data.desc?"":data.desc);
    },
    warning:(txt,at)=>{
      setInfo(txt);
      if(at!==undefined){
        setTimeout(() => {
          setInfo("");
        }, at);
      }
    },
  }

  useEffect(() => {
    GENE.get(props.name, (dt) => {
      if (dt.error) return false;
      self.updateData(dt);
    });
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
            <small>iNFT Width</small>
            <input type="number" className="form-control" value={width} onChange={(ev) => {
              self.changeWidth(ev);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
            <small>iNFT Height</small>
            <input type="number" className="form-control" value={height} onChange={(ev) => {
              self.changeHeight(ev);
            }} />
          </Col>
        </Row>

        <Row>
          <Col md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
            <h5>Cell Size</h5>
          </Col>
          <Col md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
            <small>Cell Width</small>
            <input type="number" className="form-control" value={cellX} onChange={(ev) => {
              self.changeCellX(ev);
            }} />
          </Col>
          <Col md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
            <small>Cell Height</small>
            <input type="number" className="form-control" value={cellY} onChange={(ev) => {
              self.changeCellY(ev);
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