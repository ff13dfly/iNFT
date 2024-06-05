import {Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

/* iNFT series preview
*   @param  {array}     data          //series array
*   @param  {array}     parts         //parts array
*/

function SeriesINFT(props) {

  const size = {
    row: [12],
  };

  let [list, setList]=useState([]);

  const self={
    calcRarity:(parts,index)=>{
      let n=1;    //target
      let m=1;    //sum
      for(let i=0;i<parts.length;i++){
        const row=parts[i];
        const rt=row.rarity[index];
        const divide=row.value[2];
        n=n*rt.length;
        m=m*divide;
      }
      return parseInt(m/n).toLocaleString();
    },
  }

  useEffect(() => {
    console.log(props.data);
    console.log(props.parts);
    setList(props.data);
  }, [props.data,props.parts]);

  return (
      <Row className='pb-'>
        {list.map((row, index) => (
          <Col className='pt-1' key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {row.name},{row.desc}, 1/{self.calcRarity(props.parts,index)}
          </Col>  
        ))}
    </Row>
  );
}
export default SeriesINFT;