import { Row, Col } from 'react-bootstrap';
import { useEffect,useState } from "react";

function PartsINFT(props) {

  const size = {
    row: [12],
    grid:[2],
  };

  let [parts, setParts]=useState([]);

  useEffect(() => {

  }, []);

  return (
      <Row className='pb-2 text-center'>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Value calculation here
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#1</button>
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#2</button>
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#3</button>
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#4</button>
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#5</button>
        </Col>
        <Col className='pt-1' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <button className='btn btn-md btn-secondary'>#6</button>
        </Col>
    </Row>
  );
}
export default PartsINFT;