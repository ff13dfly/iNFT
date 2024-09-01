import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import API from "../../system/api";
import TPL from "../../system/tpl";
import Config from "../../system/config";
import Bounty from "../../system/bounty";
import Account from "../../system/account";
import RUNTIME from "../../system/runtime";

import tools from "../../lib/tools";

import PriveiwINFT from "../common/inft_preview";

import { FaCheck } from "react-icons/fa";

/* Bonus apply submission dailog
*   @param  {object}    data        //raw bounty data from backend, the anchor data is docked on key "orgin"
*   @param  {number}    index       //index of bonus
*   @param  {function}  dialog      //system dialog 
*/

function BountyApply(props) {
  //Bootstrap Col setting
  const size = {
    row: [12],
    half: [6],
    right: [5, 7],
    left: [9, 3],
    sub: [5, 4],
  };

  //rendering parameters
  let [thumb, setThumb] = useState(`${window.location.origin}/imgs/logo.png`);    //Wanted iNFT thumb
  let [search, setSearch] = useState("");       //iNFT name to search
  let [info, setInfo] = useState("");           //iNFT search result
  let [hidden, setHidden] = useState(false);    //Wethe hide the search iNFT thumb
  let [hash, setHash] = useState("");           //iNFT result hash
  let [template, setTemplate] = useState("");   //iNFT result gene template cid
  let [offset, setOffset] = useState([]);       //iNFT result offset
  let [owner, setOwner] = useState("");         //iNFT result owner

  let [disable, setDisable] = useState(true);   //Apply function disable/enable
  let [sub, setSub] = useState(false);          //Wether owned by sub account
  let [password, setPassword] = useState("");     //sub account password

  //apply parameters
  let [same, setSame] = useState(true);             //Wether use the iNFT owner as bonus receiver  
  let [receiver, setReceiver] = useState("");       //receive address
  let [chainInfo, setChainInfo] = useState("");     //apply button clicked status

  //FIXME, need to get this from coin setting
  let [network, setNetwork] = useState("anchor");   //network to get bonus

  const self = {
    changeNetwork: (ev) => {
      setNetwork(ev.target.value);
    },
    changeReceiver: (ev) => {
      setReceiver(ev.target.value);
    },
    changePassword: (ev) => {
      setPassword(ev.target.value);
    },
    changeSearch: (ev) => {

      const name = ev.target.value;
      setSearch(name);

      self.initApply();

      //1.get the iNFT result to show
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

        //2.check iNFT valid
        // when test apply, comment these codes
        // const target = props.data.orgin.raw.bonus[props.index];
        // const tpl=props.data.template;
        // const check=INFT.check(inft,tpl,target);
        // let amount=0;
        // for(let i=0;i<check.length;i++){
        //   if(check[i]===0) amount++;
        // }
        // if(amount!==0){
        //   return setInfo(`${amount} ${amount===1?"part":"parts"} are not matched of this iNFT.`);
        // }

        //3.check wether owned by main account
        const checkOwner = inft.owner;
        RUNTIME.auto((addr) => {
          if (addr === checkOwner) {
            setSub(false);
            setDisable(false);
            return true;
          }
          //4.check wether owned by sub accounts
          Account.check(checkOwner, (exsist) => {
            if (!exsist) {
              setSub(false);
              setDisable(true);
              return true;
            }
            setSub(true);
            setDisable(false);
          });
        });
      });
    },
    clickSame: () => {
      setSame(!same);
      if (!same) {
        setReceiver(owner);
      } else {
        setReceiver("");
      }
    },
    clickApply: (ev) => {
      self.getAnchor(search, (dt) => {
        if (dt === false) {
          return setChainInfo("Invalid iNFT");
        }

        //0.prepare the apply_anchor
        const alink = props.data.alink;
        const inft_alink = `anchor://${dt.name}/${dt.block}`;
        const name = Bounty.format.name("apply");
        const obj = {
          anchor: name,
          raw: Bounty.format.raw.apply(alink, props.index, inft_alink, network, receiver),
          protocol: Bounty.format.protocol.apply(alink),
          dapp: Config.get(["system", "name"]),
        }

        //1.check the anchor status
        const owner = dt.owner;   //iNFT owner
        if (sub) {
          Account.check(owner, (exsist) => {
            if(!exsist) return setChainInfo("No sub account to go on.");
            //console.log(exsist, sub);
            self.applyBySubAccount(owner,password,obj, inft_alink);
          });
        } else {
          RUNTIME.auto((addr) => {
            if (owner !== addr) return setChainInfo("Not the owner of iNFT.");
            self.applyByWallet(obj, inft_alink);
          });
        }
      });
    },
    applyByWallet: (obj, inft_alink) => {
      const alink = props.data.alink;
      const chain = Network("anchor");
      chain.sign(obj, (res) => {
        setChainInfo(res.msg);
        if (res.status === "Finalized") {
          setTimeout(() => {
            setChainInfo("");
          }, 1500);

          self.getAnchor(obj.anchor, (record) => {
            const rlink = `anchor://${record.name}/${record.block}`;
            API.bounty.apply(alink, inft_alink, rlink, (res) => {
              props.dialog.close();
            });
          });
        }
      });
    },
    applyBySubAccount: (addr,pass, obj, inft_alink) => {
      console.log(addr,pass, obj, inft_alink);
      Account.get(addr,(arr)=>{
        if(arr.length!==1) return setChainInfo("Invalid sub account.");
        const chain=Network("anchor");
        try {
          chain.load(JSON.stringify(arr[0]), password, (pair) => {
            if(pair.error) return setChainInfo(pair.error);
            chain.write(pair,obj,(res)=>{
              setChainInfo(res.msg);
              if (res.status === "Finalized") {
                setTimeout(() => {
                  setChainInfo("");
                }, 1500);
      
                self.getAnchor(obj.anchor, (record) => {
                  const rlink = `anchor://${record.name}/${record.block}`;
                  const alink = props.data.alink;
                  API.bounty.apply(alink, inft_alink, rlink, (res) => {
                    props.dialog.close();
                  });
                });
              }
            });
          });
        } catch (error) {
          return setChainInfo("Invalid account encry file.");
        }
      });
      
    },  

    showINFT: (inft) => {
      setHash(inft.hash);
      setOffset(inft.raw.offset);
      setOwner(inft.owner);
      setTemplate(inft.raw.tpl);
      if (same) setReceiver(inft.owner);
    },

    initApply: () => {
      setInfo("");
      setHidden(false);
      setSub(false);
      setDisable(true);
    },
    getAnchor: (name, ck) => {
      const chain = Network("anchor");
      chain.view({ name: name }, "anchor", ck);
    },
    showBonus: (data, index) => {
      const target = data.orgin.raw.bonus[index];
      TPL.view(data.template.cid, (res) => {
        const dt = res.series[target.series];
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
        <input className="form-control" type="text" value={search} placeholder="Input the iNFT name" onChange={(ev) => {
          self.changeSearch(ev);
        }} />
      </Col>
      <Col className="pt-2" md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {info}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col hidden={false} className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
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
          <Col hidden={false} className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <h5>Bounty wanted</h5>
            <img src={thumb} className="inft_thumb" alt="" />
          </Col>
        </Row>
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col hidden={false} className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            iNFT owner: {tools.shorten(owner, 12)}
          </Col>
          <Col hidden={false} className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>

          </Col>
        </Row>
      </Col>

      <Col className="pt-2" md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <input type="text" hidden={same} className="form-control" placeholder="The account address to accept the bonus coins/token." value={receiver} onChange={(ev) => {
          self.changeReceiver(ev)
        }} />
      </Col>
      <Col className="pt-3 text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className={same ? "btn btn-sm btn-default" : "btn btn-sm btn-primary"} onClick={(ev) => {
          self.clickSame(ev)
        }}><FaCheck /></button>
        <span className="ml-10">Other receiver</span>
      </Col>

      <Col className="pt-2" hidden={!sub} md={size.sub[0]} lg={size.sub[0]} xl={size.sub[0]} xxl={size.sub[0]}>
        <input type="password" className="form-control" value={password}
          placeholder={`Password of ${tools.shorten(owner, 6)}`} onChange={(ev) => {
            self.changePassword(ev);
          }} />
      </Col>
      <Col className="pt-2" hidden={!sub} md={size.sub[1]} lg={size.sub[1]} xl={size.sub[1]} xxl={size.sub[1]}>
        {chainInfo}
      </Col>
      <Col className="pt-2" hidden={sub} md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        {chainInfo}
      </Col>
      <Col className="pt-2 text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button disabled={disable} className="btn btn-md btn-primary" onClick={(ev) => {
          self.clickApply(ev);
        }}>Apply</button>
      </Col>

    </Row>
  );
}
export default BountyApply;