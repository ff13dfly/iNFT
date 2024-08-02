import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Network from "../network/router";
import tools from "../lib/tools";

import API from "../system/api";
import TPL from "../system/tpl";
import Config from "../system/config";

import PriveiwINFT from './inft_preview';

function BountyApply(props) {
  const size = {
    row: [12],
    half: [6],
    right: [4, 8],
    left: [8, 4],
  };

  let [search, setSearch] = useState("");
  let [info, setInfo] = useState("");
  let [thumb, setThumb] = useState(`${window.location.origin}/imgs/logo.png`);

  let [hiddenPreview, setHiddenPreview] = useState(true);
  let [disable, setDisable] = useState(true);
  let [hidden, setHidden] = useState(false);

  let [hash, setHash] = useState("");
  let [template, setTemplate] = useState("");
  let [offset, setOffset] = useState([]);
  let [owner, setOwner] = useState("");

  //apply details
  let [network, setNetwork] = useState("anchor");   //network to get bonus
  let [receiver, setReceiver] = useState("");        //receive address
  let [chainInfo, setChainInfo] = useState("");      //apply button clicked status
  const self = {
    changeNetwork: (ev) => {
      setNetwork(ev.target.value);
    },
    changeReceiver: (ev) => {
      setReceiver(ev.target.value);
    },
    changeSearch: (ev) => {

      const name = ev.target.value;
      setSearch(name);

      setInfo("");
      setHidden(false);
      //setHiddenPreview(true);

      self.getAnchor(name, (inft) => {
        if (inft === false) {
          setHidden(true);
          return setInfo(`No such iNFT ${name}`);
        }
        if (!inft.protocol || !inft.protocol.fmt || !inft.protocol.tpl || inft.protocol.tpl !== "inft") return setInfo(`Not iNFT anchor ${name}`);
        if (!inft.raw || !inft.raw.tpl || inft.raw.tpl !== props.data.template.cid) {
          self.showINFT(inft);
          return setInfo(`Not target template.`);
        }

        self.showINFT(inft);
        setDisable(false);

      });
    },
    clickApply: (ev) => {
      const alink = props.data.alink;
      self.getAnchor(search, (dt) => {
        const inft = `anchor://${dt.name}/${dt.block}`;
        //1.write on chain
        const name = self.getApplyName(8).toLocaleLowerCase();
        const raw = self.getApplyData(inft);
        const protocol = { fmt: "json", type: "data", ref: alink };    //"ref" is the keyword of Easy Protocol

        const dapp = Config.get(["system", "name"]);
        const obj = {
          anchor: name,
          raw: raw,
          protocol: protocol,
          dapp: dapp,
        }

        const chain = Network("anchor");
        chain.sign(obj, (res) => {
          setChainInfo(res.msg);

          if (res.status === "Finalized") {
            setTimeout(() => {
              setChainInfo("");
            }, 1500);

            self.getAnchor(name, (record) => {
              console.log(record);
              const rlink = `anchor://${record.name}/${record.block}`;

              //2.report to portal
              API.bounty.apply(alink, inft, rlink, (res) => {
                console.log(res);

                //3.save to local indexedDB

              });
            });
          }
        });
      });
    },
    getApplyData: (inft_link) => {
      //console.log(props.data,props.index);
      return {
        inft: inft_link,      //apply inft anchor link
        target: props.data.alink,    //bounty anchor link
        bonus: props.index,      //bonus index
        receiver: {
          network: network,
          address: receiver,
        }
      }
    },
    getApplyName: (n) => {
      return `apply_${tools.char(n)}`;
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
    getAnchor: (name, ck) => {
      const chain = Network("anchor");
      chain.view({ name: name }, "anchor", ck);
    },
    showBonus: (data, index) => {
      const target = data.detail.bonus[index];
      console.log(target);
      TPL.view(data.template.cid, (res) => {
        //console.log(res);
        const dt = res.series[target.series];
        //console.log(dt)
        setThumb(dt.thumb[0]);
      });
    },
  }

  useEffect(() => {
    self.showBonus(props.data, props.index);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
        <input className='form-control' type="text" value={search} placeholder='Input the iNFT name' onChange={(ev) => {
          self.changeSearch(ev);
        }} />
      </Col>
      <Col className='pt-2' md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {info}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col hidden={false} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <h5>Your iNFT</h5>
            <PriveiwINFT
              id={"apply_view"}
              hash={hash}
              hidden={hidden}
              template={template}
              offset={offset}
              force={true}
              hightlight={false}
            />
          </Col>
          <Col hidden={false} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <h5>Bounty wanted</h5>
            <img src={thumb} className='inft_thumb' alt="" />
          </Col>
        </Row>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col hidden={false} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            {tools.shorten(owner, 12)}
          </Col>
          <Col hidden={false} className='pt-2' md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>

          </Col>
        </Row>
      </Col>


      <Col className='pt-2' md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        {chainInfo}
      </Col>
      <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button disabled={disable} className='btn btn-md btn-primary' onClick={(ev) => {
          self.clickApply(ev);
        }}>Apply</button>
      </Col>

    </Row>
  );
}
export default BountyApply;