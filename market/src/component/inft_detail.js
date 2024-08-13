import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import { FaSlackHash,FaPizzaSlice,FaUserLock } from "react-icons/fa";

import tools from "../lib/tools";


/* iNFT render component parameters
*   @param  {object}    data            //iNFT data
*   @param  {boolean}   [noPrice]       //wether show price
*   @param  {boolean}   [noBuy]        //wether show price
*   @param  {function}  link          //link convert function
*/

function DetailINFT(props) {
  const size = {
    row: [12],
    info:[4,8],
    more:[1,11],
  };

  useEffect(() => {
    //console.log(props.data);
  }, []);

  return (
    <Row className="pb-4">
      <Col hidden={props.noPrice} className="pt-1" md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
        <small>Price</small>
      </Col>
      <Col hidden={props.noPrice} className="pt-1" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
        <h3 className="text-warning">{props.data && props.data.price?props.data.price:0}</h3>
      </Col>

      <Col className="pt-1" md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
        <small>Network</small>
      </Col>
      <Col className="pt-1" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
        <h3 className="text-warning">{tools.toUp(props.data && props.data.network?props.data.network:"")}</h3>
      </Col>

      <Col className="pt-1" md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
        <small>Name</small>
      </Col>
      <Col className="pt-1" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
        <h3 className="text-warning">{props.data && props.data.name?props.data.name:""}</h3>
      </Col>

      <Col className="pt-1" md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
        <small>Block</small>
      </Col>
      <Col className="pt-1" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
        <h3 className="text-warning">{props.data && props.data.block?props.data.block.toLocaleString():0}</h3>
      </Col>
    </Row>
  );
}
export default DetailINFT;