import { Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";

import BountyApply from './bounty_apply';

import tools from "../lib/tools";
import { FaClock,FaPizzaSlice } from "react-icons/fa";

function BountyShow(props) {
  const size = {
    row: [12],
    grid: [3, 4, 5],
    left: [3,9],
  };

  let [ready, setReady] = useState(false);
  let [data, setData] = useState({});   //bounty raw data with template detail
  let [bonus, setBonus] = useState([]);
  let [coin, setCoin] = useState("");
  let [progress, setProgress] = useState([]);
  let [total, setTotal] = useState(0);

  let [block, setBlock] = useState(0);    //current block number

  const self = {
    clickSubmit:(index,alink)=>{
      props.dialog.show(<BountyApply data={data} index={index} dialog={props.dialog}/>,"Bounty apply");
    },
    calcBonus: (list) => {
      let amount = 0;
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        amount += parseInt(row.amount) * row.bonus
      }
      return amount;
    },
    getThumb: (index) => {
      //console.log(data.template.raw);
      if (!data.template || !data.template.raw || !data.template.raw.series) return false;
      const dt = data.template.raw.series[index];
      return dt.thumb[0];
    },
  }

  useEffect(() => {
    setReady(false);
    if (props.data && props.data.template) {
      const data = props.data;
      console.log(data);
      setData(data);
      setReady(true);

      if (data.detail && data.detail.bonus) {
        setBonus(data.detail.bonus);
        setTotal(self.calcBonus(data.detail.bonus));
      }
      if (data.coin) setCoin(data.coin);
    }
  }, [props.data]);

  return (
    <Row hidden={!ready}>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Card style={{ width: '100%' }}>
          <a href={"#"}>
            <Card.Img variant="top" src={data.template && data.template.raw ? data.template.raw.image : `${window.location.origin}/imgs/logo.png`} />
          </a>
          <Card.Body>
            <Card.Title>{data.detail && data.detail.title ? data.detail.title : ""}</Card.Title>
            <Card.Text>
              {data.detail && data.detail.desc ? data.detail.desc : ""}
            </Card.Text>
          </Card.Body>
        </Card>
        <p>
          <FaClock /> {parseInt(data.start).toLocaleString()} ~ {parseInt(data.end).toLocaleString()} ( current: {block.toLocaleString()} )<br/>
          <FaPizzaSlice />{data && data.template && data.template.cid?
          (<span className='pointer ml-5' onClick={(ev)=>{props.link("playground",[data.template.cid])}}>
            {tools.shorten(data.template.cid,15)}
          </span>):""
        }
        </p>
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <h6>Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h6>
        {bonus.map((row, index) => (
          <Row key={index} className='pt-2'>
            <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
              <img alt="" src={self.getThumb(row.series)} className='series_thumb pointer' />

            </Col>
            <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
              <Row>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <strong>{row.bonus.toLocaleString()}</strong> ${coin.toUpperCase()}/piece<br />
                  Progress: {!progress[row.series] ? 0 : progress[row.series]}/{row.amount}
                </Col>
                <Col className='text-end' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <button className='btn btn-sm btn-primary' onClick={(ev)=>{
                    self.clickSubmit(index,data.alink);
                  }}>submit</button>
                </Col>
              </Row>
            </Col>

          </Row>
        ))}
      </Col>
      <Col md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        The minting result showing.
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
    </Row>
  );
}
export default BountyShow;