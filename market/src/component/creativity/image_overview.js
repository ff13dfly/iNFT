import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import ImageOperation from "./image_operation";
import ImageOrgin from "./image_orgin";
import ImageParameter from "./image_parameter";
import PartSelector from "./parts_selector";

import GENE from "../../system/gene";

/* Image editor entry
*   @param  {string}    name        //unique hash
*/

function ImageOverview(props) {
  const size = {
    row: [12],
    left: [9, 3]
  };

  let [active, setActive] = useState(0);      //current active part, for modification.
  let [amount, setAmount]=useState(0);        //parts amount for selector
  let [order, setOrder] = useState(0);        //the selected part image order

  const self = {
    fresh:()=>{

    },
  }

  useEffect(() => {
    GENE.get(props.name, (dt) => {
      if (dt.error) return self.warning(dt.error);
      if(!dt.parts) return self.warning("Invalid Gene data format");
      setAmount(dt.parts.length);
    });
  }, []);

  return (
    <Row>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]} >
        <ImageOperation name={props.name} index={active} order={order}/>
        <PartSelector amount={amount}  callback={(index)=>{
          setActive(index);
        }}/>
        <ImageOrgin name={props.name} index={active} callback={(od)=>{
          setOrder(od);
        }}/>
      </Col>
      <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]} >
        <ImageParameter name={props.name} index={active}  />
      </Col>
    </Row>
  );
}
export default ImageOverview;