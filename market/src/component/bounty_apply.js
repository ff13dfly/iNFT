import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Network from "../network/router";

function BountyApply(props) {
  const size = {
    row: [12],
    right:[4,8],
    left:[8,4],
  };

  let [search, setSearch] = useState("");
  let [info, setInfo] = useState("");

  let [disable, setDisable] = useState(true);

  const self = {
    changeSearch:(ev)=>{
      const name=ev.target.value;
      setSearch(name);
      setInfo("");
      self.getINFT(name,(inft)=>{
        if(inft===false) return setInfo(`No such iNFT ${name}`);
        if(!inft.protocol || !inft.protocol.fmt ||!inft.protocol.tpl || inft.protocol.tpl!=="inft") return setInfo(`Not iNFT anchor ${name}`);
        if(!inft.raw || !inft.raw.tpl || inft.raw.tpl!==props.data.template.cid){

          return setInfo(`Not target tempalte.`);
        }
        //setDisable(true);
      });
    },

    checkValid:()=>{

    },
    getINFT:(name,ck)=>{
      const chain=Network("anchor");
      chain.view({name:name},"anchor",ck);
    },
  }

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
        <input className='form-control' type="text" value={search} onChange={(ev)=>{
          self.changeSearch(ev);
        }}/>
      </Col>
      <Col className='pt-2' md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {info}
      </Col>

      <Col className='pt-2' md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}></Col>
      <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button disabled={disable} className='btn btn-md btn-primary'>Apply</button>
      </Col>
      
    </Row>
  );
}
export default BountyApply;