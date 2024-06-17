import { Row, Col } from 'react-bootstrap';
import { useEffect } from "react";

function FilterMarket(props) {

  const size = {
    row: [12],
    grid: [5, 3, 4],
    price: [4, 4, 4]
  };


  useEffect(() => {

  }, [props.update]);

  return (
    <Row>
      <Col className='pt-2' md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <select className='form-control'>
          <option value="">----------</option>
          <option value="">Tempalte_a</option>
          <option value="">Tempalte_b</option>
        </select>
      </Col>
      <Col className='pt-2' md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
          <input type="number" className='form-control' placeholder='Page step' />
      </Col>
      <Col className='pt-2' md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        <Row>
          <Col md={size.price[0]} lg={size.price[0]} xl={size.price[0]} xxl={size.price[0]}>
            <input type="number" className='form-control' placeholder='Min' />
          </Col>
          <Col md={size.price[1]} lg={size.price[1]} xl={size.price[1]} xxl={size.price[1]}>
            <input type="number" className='form-control' placeholder='Max' />
          </Col>
          <Col className='text-end' md={size.price[2]} lg={size.price[2]} xl={size.price[2]} xxl={size.price[2]}>
            <button className='btn btn-sm btn-primary mt-1'>Set</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default FilterMarket;