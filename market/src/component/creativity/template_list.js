import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CreativityBasic from "./creativity_basic";
import CreativitySingle from "./creativity_single";

/* Component Sample
*   @param  {string}    hash        //unique hash
*   @param  {string}    active      //active gene template
*/

function TemplateList(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self = {
    clickGene: (index) => {
      if (props.show) props.show(<div>
        <CreativityBasic />
        <CreativitySingle />
      </div>);
    },
  }

  useEffect(() => {
    const arr = [{ mock: "a" }, { mock: "b" }]
    setList(arr);
  }, []);

  return (
    <Row>
      {list.map((row, index) => (
        <Col key={index} className="pointer" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <button className="btn btn-md btn-default" onClick={(ev) => {
            self.clickGene(index);
          }}>{JSON.stringify(row)}</button>
        </Col>
      ))}
    </Row>
  );
}
export default TemplateList;