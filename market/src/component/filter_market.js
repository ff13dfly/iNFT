import { Row, Col } from 'react-bootstrap';
import { useEffect,useState } from "react";

import { FaTh,FaThLarge,FaThList } from "react-icons/fa";

import INFT from "../lib/inft";
import TPL from "../lib/tpl";

function FilterMarket(props) {

  const size = {
    row: [12],
    grid: [5, 3, 4],
    price: [4, 4, 4]
  };

  let [tpls,setTpls]=useState([]);
  let [min,setMin]=useState(0);
  let [max,setMax]=useState(0);

  const self={
    changeMin:(ev)=>{

    },
    changeMax:(ev)=>{

    },
    getTemplates:(list,ck,arr)=>{
      if(arr===undefined) arr=[];
      if(list.length===0) return ck && ck(arr);
      const cid=list.pop();
      TPL.view(cid,(single)=>{
        single.cid=cid;
        arr.push(single);
        return self.getTemplates(list,ck,arr);
      });
    },
    filterByTemplate:(cid)=>{
      console.log(cid);
    },
  }

  useEffect(() => {
    console.log(`Ready to fresh from filter_market`)
    INFT.overview((dt)=>{
      if(dt.template.length!==0){
        self.getTemplates(dt.template,(ts)=>{
          console.log(ts);
          setTpls(ts);
        });

        setMin(dt.range[0]);
        setMax(dt.range[1]);
      }
    });
  }, [props.update]);

  return (
    <Row>
      <Col className='pt-2' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        {tpls.map((row, index) => (
          <img className='template_icon pointer' key={index} src={row.thumb} alt="" onClick={(ev)=>{
            self.filterByTemplate(row.cid);
          }}/>
        ))}
        <span className='ml-10'>|</span>
        <FaThList size={28} className='filter_icon ml-10'/>
        <FaThLarge size={28} className='filter_icon ml-10'/>
        <FaTh size={28} className='filter_icon ml-10'/>
      </Col>
      <Col className='pt-2' md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        
      </Col>
      <Col className='pt-2' md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        <Row>
          <Col md={size.price[0]} lg={size.price[0]} xl={size.price[0]} xxl={size.price[0]}>
            <input type="number" className='form-control' placeholder='Min' value={min} onChange={(ev)=>{
              self.changeMin(ev);
            }}/>
          </Col>
          <Col md={size.price[1]} lg={size.price[1]} xl={size.price[1]} xxl={size.price[1]}>
            <input type="number" className='form-control' placeholder='Max' value={max} onChange={(ev)=>{
              self.changeMax(ev);
            }}/>
          </Col>
          <Col className='text-end' md={size.price[2]} lg={size.price[2]} xl={size.price[2]} xxl={size.price[2]}>
            <button className='btn btn-sm btn-primary mt-1'>Search</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default FilterMarket;