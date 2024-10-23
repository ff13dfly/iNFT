import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import ChargeEthereumUSDT from "../charge/charge_ethereum_usdt";

/* Component Sample
*   @param  {string}    props.hash        //unique hash
*/

function UseCharge(props) {
  const size = {
    row: [12],
    left: [8, 4],
  };

  let [active, setActive] = useState("");

  const self = {

  }

  useEffect(() => {

  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        1 Million iNFTs by 1 $ANK, only 19.9 $USDT. 0.0000199 USDT/iNFT, or 500 iNFT/cent.
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Tabs
          defaultActiveKey="metamask"
          id="uncontrolled-tab-example"
          className="mb-3 pt-2"
          fill
          onSelect={(tab) => {
            setActive(tab);
          }}>
          <Tab eventKey="metamask" title="USDT">
            <ChargeEthereumUSDT />
          </Tab>
          <Tab eventKey="binance" title="Wallet">
            <Row>
              <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]} >

              </Col>
              <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]} >

              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}
export default UseCharge;