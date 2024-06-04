import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import ParameterINFT from './inft_parameter';
import tools from "../lib/tools";

function PartsINFT(props) {

  const size = {
    row: [12],
    grid: [2],
    parts:[11,1]
  };

  let [cur, setCurrent] = useState(0);

  let [parts, setParts] = useState([]);
  let [value, setValue] = useState({});

  const self={
    clickPart:(index)=>{
      //console.log(index);
      const target=parts[index];
      setValue(tools.copy(target));
      setCurrent(index);
    },  
  }

  useEffect(() => {
    setParts(props.data);
    console.log(props.data[cur]);
    if(props.data && props.data[cur]) setValue(tools.copy(props.data[cur]));
  }, [props.data]);

  return (
    <Row className="pt-2">
      <Col md={size.parts[0]} lg={size.parts[0]} xl={size.parts[0]} xxl={size.parts[0]} >
        <ParameterINFT data={value} />
      </Col>
      <Col md={size.parts[1]} lg={size.parts[1]} xl={size.parts[1]} xxl={size.parts[1]} >
        <Row className='pb-2 text-center'>
          {parts.map((row, index) => (
            <Col className='pt-1' key={index} md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
              <button className={index===cur?'btn btn-md btn-primary':'btn btn-md btn-secondary'} onClick={(ev)=>{
                self.clickPart(index)
              }}>#{index+1}</button>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>

  );
}
export default PartsINFT;