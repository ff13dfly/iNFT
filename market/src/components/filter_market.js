import { Row, Col } from 'react-bootstrap';
import { useEffect } from "react";

function FilterMarket(props) {

  const size = {
    row: [12],
  };


  useEffect(() => {
    
  }, [props.update]);

  return (
      <Row>
        <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <h4>iNFT Filter</h4>
        </Col>
        <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Wanted
        </Col>
        <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Selling
        </Col>
        <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Price
        </Col>
    </Row>
  );
}
export default FilterMarket;