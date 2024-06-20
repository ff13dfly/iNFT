import {Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import TPL from  "../lib/tpl";

/* iNFT series preview
*   @param  {array}     data          //series array
*   @param  {array}     parts         //parts array
*/

function SeriesINFT(props) {

  const size = {
    row: [12],
  };

  let [list, setList]=useState([]);
  let [parts, setParts]=useState([]);

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
    clickSingle:(mock)=>{
      console.log(mock);
      props.fresh(mock);
    },
  }



  useEffect(() => {
    const cid=props.template;
    TPL.view(cid,(def)=>{
      if(def && def.series){
        console.log(def.series);
        setList(def.series);
        setParts(def.parts);
      }
    });
  }, [props.template]);

  return (
      <Row className='pb-1'>
        {list.map((row, index) => (
          <Col className='pt-1' key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {row.name},{row.desc}, 1/{self.calcRarity(parts,index)}
            {row.thumb &&  row.thumb.map((img, iindex) =>(
              <img  key={iindex} src={img} className='series_thumb pointer' onClick={(ev)=>{
                self.clickSingle(row.mock[iindex]);
              }}/>
            ))}
          </Col>
        ))}
    </Row>
  );
}
export default SeriesINFT;