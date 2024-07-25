import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Network from "../network/router";
import PriveiwINFT from './inft_preview';

import TPL from "../system/tpl";
import tools from "../lib/tools";


function BountyApply(props) {
  const size = {
    row: [12],
    half: [6],
    right: [4, 8],
    left: [8, 4],
  };

  let [search, setSearch] = useState("");
  let [info, setInfo] = useState("");
  let [thumb, setThumb]= useState(`${window.location.origin}/imgs/logo.png`);

  let [hiddenPreview, setHiddenPreview] = useState(true);
  let [disable, setDisable] = useState(true);


  let [hash, setHash] = useState("");
  let [template, setTemplate] = useState("");
  let [offset, setOffset] = useState([]);
  let [owner, setOwner] = useState("");

  const self = {
    changeSearch: (ev) => {
      const name = ev.target.value;
      setSearch(name);

      setInfo("");
      setHiddenPreview(true);

      self.getINFT(name, (inft) => {
        if (inft === false) return setInfo(`No such iNFT ${name}`);
        if (!inft.protocol || !inft.protocol.fmt || !inft.protocol.tpl || inft.protocol.tpl !== "inft") return setInfo(`Not iNFT anchor ${name}`);
        if (!inft.raw || !inft.raw.tpl || inft.raw.tpl !== props.data.template.cid) {
          self.showINFT(inft);
          return setInfo(`Not target template.`);
        }

        self.showINFT(inft);


      });
    },
    showINFT: (inft) => {
      setHash(inft.hash);
      setOffset(inft.raw.offset);
      setOwner(inft.owner);
      setTemplate(inft.raw.tpl);
      setHiddenPreview(false);
    },

    checkValid: () => {

    },
    getINFT: (name, ck) => {
      const chain = Network("anchor");
      chain.view({ name: name }, "anchor", ck);
    },
    showBonus:(data,index)=>{
      const target=data.detail.bonus[index];
      console.log(target);
      TPL.view(data.template.cid,(res)=>{
        //console.log(res);
        const dt=res.series[target.series];
        //console.log(dt)
        setThumb(dt.thumb[0]);
      });
    },
  }

  useEffect(() => {
    self.showBonus(props.data,props.index);
    
  }, [props.data]);

  return (
    <Row>
      <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
        <input className='form-control' type="text" value={search} onChange={(ev) => {
          self.changeSearch(ev);
        }} />
      </Col>
      <Col className='pt-2' md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {info}
      </Col>

      <Col hidden={hiddenPreview} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <h5>Your iNFT</h5>
        <PriveiwINFT
          id={"apply_view"}
          hash={hash}
          template={template}
          offset={offset}
          force={true}
          hightlight={false}
        />
        {tools.shorten(owner, 12)}
      </Col>
      <Col hidden={hiddenPreview} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
        <h5>Bounty wanted</h5>
        <img src={thumb} className='inft_thumb' alt=""/>
      </Col>

      <Col className='pt-2' md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}></Col>
      <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button disabled={disable} className='btn btn-md btn-primary'>Apply</button>
      </Col>

    </Row>
  );
}
export default BountyApply;