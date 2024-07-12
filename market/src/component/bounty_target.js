import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { FaSkullCrossbones } from "react-icons/fa";

import tools from "../lib/tools";

let series= null;
function BountyTarget(props) {
  const size = {
    row: [12],
    half: [6],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
    bonus: [3, 4, 4, 1],
  };

  let [list, setList] = useState([]);
  
  const single = {
    series: 0,
    bonus: 100,
    amount: 10
  };

  const self = {
    clickAdd: (ev) => {
      const nlist = tools.clone(list);
      nlist.push(tools.clone(single));
      setList(nlist);
    },
    clickRemove: (index) => {
      const nlist = [];
      for (let i = 0; i < list.length; i++) {
        if (i !== index) nlist.push(list[i]);
      }
      setList(nlist);
    },
  }

  useEffect(() => {
    if(props.data && props.data.series){
      console.log(props.data.series);
      series = props.data.series;
    }
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

        <Row hidden={list.length === 0} className='pt-1'>
          <Col md={size.bonus[0]} lg={size.bonus[0]} xl={size.bonus[0]} xxl={size.bonus[0]} >Series</Col>
          <Col md={size.bonus[1]} lg={size.bonus[1]} xl={size.bonus[1]} xxl={size.bonus[1]} >Bonus</Col>
          <Col md={size.bonus[2]} lg={size.bonus[2]} xl={size.bonus[2]} xxl={size.bonus[2]} >Amount</Col>
          <Col md={size.bonus[3]} lg={size.bonus[3]} xl={size.bonus[3]} xxl={size.bonus[3]} ></Col>
        </Row>

        {list.map((row, index) => (
          <Row key={index} className='pt-1'>
            <Col md={size.bonus[0]} lg={size.bonus[0]} xl={size.bonus[0]} xxl={size.bonus[0]} >
              <select className='form-control' onChange={(ev) => {

              }}>
                {series!==null && series.map((ss, order) => (
                  <option key={order} value={order}>#{order} {ss.name}</option>
                ))}
              </select>
            </Col>
            <Col md={size.bonus[1]} lg={size.bonus[1]} xl={size.bonus[1]} xxl={size.bonus[1]} >
              <input className='form-control' type="number" value={row.bonus} onChange={(ev) => {

              }} />
            </Col>
            <Col md={size.bonus[2]} lg={size.bonus[2]} xl={size.bonus[2]} xxl={size.bonus[2]} >
              <input className='form-control' type="number" value={row.amount} onChange={(ev) => {

              }} />
            </Col>
            <Col md={size.bonus[3]} lg={size.bonus[3]} xl={size.bonus[3]} xxl={size.bonus[3]} >
              <button className='btn btn-sm btn-danger' onClick={(ev) => {
                self.clickRemove(index);
              }}><FaSkullCrossbones /></button>
            </Col>
          </Row>
        ))}

      </Col>
      <Col className='text-center pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <button className='btn btn-md btn-primary' onClick={(ev) => {
          self.clickAdd();
        }}>+ bounty target</button>
      </Col>
    </Row>
  );
}
export default BountyTarget;