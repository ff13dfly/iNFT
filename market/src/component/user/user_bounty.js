import { Row, Col, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import BountySubmit from "../bounty/bounty_submit";
import BountyProcess from "../bounty/bounty_process";
import BountyLoad from "../bounty/bounty_load";

import BountySelling from "../bounty/bounty_selling";

import Bounty from "../../system/bounty";
import API from "../../system/api";
import TPL from "../../system/tpl";

import Network from "../../network/router";
import tools from "../../lib/tools";

import { FaCopy,FaBitcoin, FaSkullCrossbones, FaRoad, FaTicketAlt } from "react-icons/fa";

/* user fav bounty list. Any bounty can be loaded.
*   @param  {function}    dialog        //system dialog function
*/


function UserBounty(props) {
  const size = {
    row: [12],
    title:[4,8],
  };

  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");

  const self = {
    clickRemove: (name) => {
      Bounty.remove(name,(res)=>{
        if(res===true) return self.fresh;
      });
    },
    clickPay: (name) => {
      props.dialog.show(<BountySubmit name={name} dialog={props.dialog}/>, "Bounty Submission");
    },
    clickBounty:(name)=>{
      Bounty.get(name,(bt)=>{
        const data=tools.decode(name);
        const chain=Network("anchor");
        chain.bounty.exsist(data.name,data.block,(isThere)=>{
          //console.log(isThere);
          if(isThere!==false) return setInfo("Bounty ticket setting is exsisted.");
          props.dialog.show(<BountySelling bounty={name} dialog={props.dialog}/>, "Bounty Ticket Setting");   
        });
      });
    },
    clickSync: (name) => {
      Bounty.get(name, (bt) => {
        if(bt.error) return false;
        //if (!dt || dt.length === 0) return false;
        //const bt = dt[0];
        console.log(bt);
        const name = bt.name;
        API.bounty.exsist(name, (res) => {
          if (!res.exsist) {
            const detail = {
              bonus: bt.bonus,
              desc: bt.desc,
              publish: bt.publish,
              payer: bt.payer,
            }
            API.bounty.submit(name, bt.coin, bt.start, bt.end, JSON.stringify(bt.template), JSON.stringify(detail), (res) => {
              console.log(res);
            });
          }
        });
      });
    },
    clickProcess: (name) => {
      props.dialog.show(<BountyProcess bounty={name} />, "Bounty Process Dashboard");
    },
    getThumb: (arr, ck, tpls, map) => {
      if (tpls && tpls.length === 0) return ck && ck(map);
      if (tpls === undefined) {
        const tpls = [];
        for (let i = 0; i < arr.length; i++) {
          const row = arr[i];
          tpls.push(row.template.cid);
        }
        return self.getThumb(arr, ck, tpls);
      }
      if (map === undefined) map = {};

      const cid = tpls.pop();
      TPL.view(cid, (dt) => {
        map[cid] = dt;
        return self.getThumb(arr, ck, tpls, map);
      });
    },
    fresh: () => {
      Bounty.list((arr) => {
        self.getThumb(arr, (map) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i].thumb = map[arr[i].template.cid].thumb;
          }
          //console.log(arr);
          setList(arr);
        });
      });
    }
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <BountyLoad fresh={""} callback={(alink)=>{
          self.fresh();
        }} />
      </Col>

      <Col className="pt-4" md={size.title[0]} lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
        <h5>Fav Bounty List</h5>
      </Col>
      <Col className="pt-4 text-danger text-end" md={size.title[1]} lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
        {info}
      </Col>

      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Coin/Token</th>
              <th>Alink</th>
              <th>Manage</th>
              <th>Loaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={index}>
                <td>
                  <a href={`http://localhost:3000/playground/${row.template.cid}`} target="_blank" rel="noreferrer">
                    <img className="template_icon" src={row.thumb} alt="template thumb" />
                  </a>
                </td>
                <td>
                  <button className="btn btn-sm btn-default" onClick={(ev) => {
                    self.clickProcess(row.name);
                  }}>
                    <FaRoad size={20} />
                  </button>
                  {row.title}
                </td>
                <td>
                  ${row.coin.toUpperCase()} (Network)
                </td>
                <td>
                  <button className="btn btn-sm btn-default">
                    <FaCopy className="" size={18}/>
                  </button>
                  <a href="https://polkadot.js.org/apps/?rpc=ws://localhost:9944#/chainstate" target="_blank" rel="noreferrer">
                    {row.name}
                  </a>
                </td>
                <td>
                  {/*
                    TODO, here to check wether the owner of bounty
                  */}
                  <button className="btn btn-sm btn-default" onClick={(ev) => {
                    self.clickPay(row.name);
                  }}>
                    <FaBitcoin size={20} />
                  </button>
                  <button className="btn btn-sm btn-default" onClick={(ev) => {
                    self.clickBounty(row.name);
                  }}>
                    <FaTicketAlt size={20} />
                  </button>
                </td>
                <td>
                  {(new Date(row.stamp).toLocaleDateString())}
                </td>
                <td>
                  <button className="btn btn-sm btn-default" onClick={(ev) => {
                    self.clickRemove(row.name);
                  }}>
                    <FaSkullCrossbones className="text-warning" size={20} />
                  </button>

                  {/* <button className="btn btn-sm btn-default" onClick={(ev) => {
                    self.clickSync(row.name);
                  }}>
                    <FaSyncAlt size={20} />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
export default UserBounty;