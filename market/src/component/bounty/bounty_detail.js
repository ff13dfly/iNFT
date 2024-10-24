import { Row, Col,Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import tools from "../../lib/tools";
import Network from "../../network/router";

/* Bounty payment detail
*   @param  {object}    props.template      //template data
*   @param  {string}    props.bounty        //bounty alink
*/

function BountyDetail(props) {
  const size = {
    row: [12],
    grid: [6],
    thumb: [4, 8],
  };

  let [list, setList] = useState([]);

  const self = {
    getParts: () => {
      if (!props.template || !props.template.parts) return 0;
      return props.template.parts.length;
    },

    selected: (bonus,coin) => {
      if (!props.template || !props.template.series) return false;
      const nlist = [];
      for (let i = 0; i < bonus.length; i++) {
        const row = tools.clone(bonus[i]);
        const se = props.template.series[row.series];
        row.thumb = se.thumb[0];
        row.name = se.name;
        row.coin=coin;
        nlist.push(row);
      }
      setList(nlist);
    },
    fresh: (alink) => {
      const dt=tools.decode(alink);
      if (dt) Network("anchor").view(dt, "anchor", (res) => {
        //1.list bonus and calc total
        self.selected(res.raw.bonus,res.raw.coin);
      });
    },
  }

  useEffect(() => {
    self.fresh(props.bounty);
  }, [props.template,props.bounty]);

  return (
    <Row className="pt-2">
      {list.map((row, index) => (
        <Col key={index} md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <Row>
            <Col md={size.thumb[0]} lg={size.thumb[0]} xl={size.thumb[0]} xxl={size.thumb[0]}>
              <img className="series_thumb" src={row.thumb} alt={row.name} />
            </Col>
            <Col md={size.thumb[1]} lg={size.thumb[1]} xl={size.thumb[1]} xxl={size.thumb[1]}>
              <h5>#{row.series} {row.name}</h5>
              <Table>
                <tbody>
                  <tr>
                    <td>Bonus</td>
                    <td>{row.bonus.toLocaleString()} ${row.coin.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Wanted</td>
                    <td>{row.amount.toLocaleString()} {row.amount===1?"piece":"pieces"}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{(row.amount*row.bonus).toLocaleString()} ${row.coin.toUpperCase()}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

        </Col>
      ))}
    </Row>
  );
}
export default BountyDetail;