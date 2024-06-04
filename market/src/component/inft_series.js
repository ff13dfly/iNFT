import {Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

function SeriesINFT(props) {

  const size = {
    row: [12],
  };

  let [list, setList]=useState([]);

  useEffect(() => {
    //console.log(props.data);
    setList(props.data);
  }, [props.data]);

  return (
      <Row className='pb-'>
        {list.map((row, index) => (
          <Col className='pt-1' key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {row.name},{row.desc}
          </Col>  
        ))}
    </Row>
  );
}
export default SeriesINFT;