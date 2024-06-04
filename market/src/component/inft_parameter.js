import {Row, Col } from 'react-bootstrap';
import { useEffect } from "react";

function ParameterINFT(props) {

  const size = {
    row: [12],
  };

  useEffect(() => {
    //console.log(props.data);
  }, [props.data]);

  return (
      <Row className='pb-4'>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Value:{!props.data.value?"":JSON.stringify(props.data.value)}
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Image:{!props.data.img?"":JSON.stringify(props.data.img)}
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Center:{!props.data.center?"":JSON.stringify(props.data.center)}
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Position:{!props.data.position?"":JSON.stringify(props.data.position)}
        </Col>
        <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          Rotation:{!props.data.rotation?"":JSON.stringify(props.data.rotation)}
        </Col>
    </Row>
  );
}
export default ParameterINFT;