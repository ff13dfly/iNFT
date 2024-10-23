import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {number}    props.amount        //unique hash
*   @param  {function}  [props.callback]      // ck && ck(index), callback the selected part index
*/

function PartSelector(props) {
  const size = {
    row: [12],
    right: [1,11],
  };

  let [list, setList] = useState([]);
  let [active, setActive] = useState(0);

  const self = {
    clickPart:(index)=>{
      setActive(index);
      if(props.callback)props.callback(index)
    },
    fresh:()=>{
      const arr=[];
      for(let i=0;i<props.amount;i++){
        arr.push({key:`part_${i}`});
      }
      setList(arr);
    }
  }

  useEffect(() => {
    self.fresh();
  }, [props.amount]);


  return (
    <Row className="pt-1 pb-1">
      <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
        <h6 className="pt-1">Parts</h6> 
      </Col>
      <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {list.map((row, index) => (
          <button 
            key={index}
            className={active===index?"btn btn-sm btn-primary mr-5":"btn btn-sm btn-default mr-5"}
            onClick={(ev)=>{
              self.clickPart(index);
            }}
          > #{index}</button>
        ))}
      </Col>
    </Row>
  );
}
export default PartSelector;