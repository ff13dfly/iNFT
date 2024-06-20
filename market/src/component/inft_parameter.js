import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaCode, FaAlignJustify } from "react-icons/fa";

function ParameterINFT(props) {

  const size = {
    row: [12],
    head: [10, 2]
  };

  let [code, setCode] = useState(false);

  const self = {
    switchCode: (ev) => {
      setCode(!code);
    },
  }

  useEffect(() => {
    //console.log(props.data);
  }, [props.data]);

  return (
    <Row className='pb-4'>
      <Col className='pt-1' md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        <h5>iNFT part details</h5>
      </Col>
      <Col className='text-end pt-1' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        <button className='btn btn-sm btn-secondary' onClick={(ev) => {
          self.switchCode(ev);
        }}>
          {!code ? <FaAlignJustify /> : <FaCode />}
        </button>
      </Col>
      <Col hidden={!code} className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <textarea className='form-control' value={JSON.stringify(props.data)} disabled></textarea>
      </Col>

      <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row hidden={code}>
          <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Value:{!props.data.value ? "" : JSON.stringify(props.data.value)}
          </Col>
          <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Image:{!props.data.img ? "" : JSON.stringify(props.data.img)}
          </Col>
          <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Center:{!props.data.center ? "" : JSON.stringify(props.data.center)}
          </Col>
          <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Position:{!props.data.position ? "" : JSON.stringify(props.data.position)}
          </Col>
          <Col className='pt-1' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Rotation:{!props.data.rotation ? "" : JSON.stringify(props.data.rotation)}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default ParameterINFT;