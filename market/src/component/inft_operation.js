import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

function OperationINFT(props) {
  const size = {
    row: [12],
    left:[8,4],
    right:[4,8],
    sell:[4,2,6],
  };

  let [ enable, setEnable ]=useState({
    sell:true,
    revoke:false,
  }); 
  let [price, setPrice] = useState(0);

  const self={
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    clickSell:(ev)=>{
      console.log(price);
    },
  }

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
            <img className='inft_thumb' src={props.data.bs64} alt="thumb of iNFT" />
          </Col>
          <Col md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
            More details.
          </Col>
        </Row>
      </Col>

      <Col className='pt-2' hidden={!enable.sell} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.sell[0]} lg={size.sell[0]} xl={size.sell[0]} xxl={size.sell[0]}>
            <input className='form-control' type="number" value={price} placeholder='Set the price to sell' onChange={(ev)=>{
              self.changePrice(ev);
            }}/>
          </Col>
          <Col className='text-end' md={size.sell[1]} lg={size.sell[1]} xl={size.sell[1]} xxl={size.sell[1]}>
            <button className='btn btn-md btn-primary' onClick={(ev)=>{
              self.clickSell(ev);
            }}>Sell</button>
          </Col>
          <Col className='text-end' md={size.sell[2]} lg={size.sell[2]} xl={size.sell[2]} xxl={size.sell[2]}>

          </Col>
        </Row>
      </Col>

      <Col hidden={!enable.revoke}  md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
          
          </Col>
          <Col className='text-end' md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            <button className='btn btn-md btn-primary'>Revoke</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default OperationINFT;