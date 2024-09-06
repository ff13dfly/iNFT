import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    name        //unique hash
*/

function SeriesSelector(props) {
  const size = {
    row: [12],
    layout:[2,10]
  };

  let [list, setList] = useState([]);

  const self = {
    getArrayByLen:(n)=>{
      const arr=[];
      for(let i=0;i<n;i++){
        arr.push({value:i});
      }
      return arr;
    },
  }

  useEffect(() => {
    const arr=[
        self.getArrayByLen(9),
        self.getArrayByLen(6),
        self.getArrayByLen(8),
        self.getArrayByLen(1)
      ]
    //console.log(arr);
    setList(arr);
  }, [props.name]);


  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Select the parts value to create series.</h5>
      </Col>
      {list.map((row, index) => (
      <Col className="pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
            #{index} Part
          </Col>
          <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
            {row.map((data, vkey) => (
              <button key={vkey} className="btn btn-sm btn-default mr-5">{data.value}</button>
            ))}
          </Col>
        </Row>
      </Col>
      ))}
    </Row>
  );
}
export default SeriesSelector;