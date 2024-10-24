import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import ListNearby from "../blacksmith/nearby_list";

import Network from "../../network/router";

/* Mint result of nearby blocks
*   @param  {number}    [props.depth]        //blocks previous amount, default to 10
*   @param  {number}    [props.grid]         //react cols amount
*/

function DashboardNearby(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  let cache = {}    //cache the iNFT result by block
  const self = {
    getList: (block, depth, ck, map) => {
      if (depth === 0) return ck && ck(map);
      if (map === undefined) {
        delete cache[block - depth - 1];    //remove the cache
        map = {};
      }

      const target = block - depth;
      depth--;

      const chain = Network("anchor");
      chain.view(target, "blocknumber", (arr) => {
        cache[target] = arr;
        map[target] = arr;
        return self.getList(block, depth, ck, map);
      });
    },
    fresh: () => {
      const chain = Network("anchor");
      chain.subscribe(`recent_blocks`, (block, hash) => {
        self.getList(block, props.depth, (map) => {
          const nlist = [];
          for (let bk in map) {
            const data = map[bk];
            if (data.length === 0) continue;
            nlist.push({
              data: map[bk],
              block: bk,
            });
          }

          if (nlist.length !== 0) {
            setList(nlist.reverse());
          }
        });
      });
    }
  }

  useEffect(() => {
    console.log(`Loaded:` + JSON.stringify(cache));
    self.fresh();
  }, [props.amount]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Recent iNFTs</h5>
      </Col>
      {/* <Tabs
        defaultActiveKey={list.length!==0?parseInt(list[0].block).toLocaleString():""}
        id="uncontrolled-tab-example"
        className="mb-3 pt-2"
        fill
        onSelect={(tab) => {

        }}>
        {list.map((row, index) => (
          <Tab key={index} eventKey={row.block} title={parseInt(row.block).toLocaleString()}>
            <small>
              Total <strong>{row.data.length}</strong> {row.data.length > 1 ? "iNFTs" : "iNFT"}
            </small>
            <ListNearby data={row.data} network={"anchor"} grid={!props.grid ? 3 : props.grid} />
          </Tab>
        ))}
      </Tabs> */}
      {list.map((row, index) => (
        <Col className="pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <small>
            Block <strong>{parseInt(row.block).toLocaleString()}</strong>,
            total <strong>{row.data.length}</strong> {row.data.length > 1 ? "iNFTs" : "iNFT"}
          </small>
          <ListNearby data={row.data} network={"anchor"} grid={!props.grid ? 3 : props.grid} />
        </Col>
      ))}
    </Row>
  );
}
export default DashboardNearby;