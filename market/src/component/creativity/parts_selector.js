import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {number}    amount        //unique hash
*   @param  {function}  callback      // ck && ck(index), callback the selected part index
*/

function PartSelector(props) {
  const size = {
    row: [12],
    amount: [3, 6, 3],
    half: [6],
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
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
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