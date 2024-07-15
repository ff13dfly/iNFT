import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

function BountyDetail(props) {
  const size = {
    row: [12],
    single: [3],
    grid: [4, 8],
    series: [5, 7],
  };

  let [series, setSeries] = useState([]);

  const self = {
    getParts:()=>{
      if(!props.data || !props.data.parts) return 0;
      return props.data.parts.length;
    },
    fresh:()=>{
      const dt = props.data;
      if(dt.series) setSeries(dt.series);
    },
  }
  
  useEffect(() => {
    self.fresh();
  }, [props.data]);

  return (
    <Row className='pt-2'>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Payment details of bounty.
      </Col>
    </Row>
  );
}
export default BountyDetail;