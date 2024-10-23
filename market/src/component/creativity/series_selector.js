import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import GENE from "../../system/gene";
import tools from "../../lib/tools";

/* Series selector
*   @param  {string}    props.name        //unique name
*   @param  {number}    props.index       //index of parts
*   @param  {number}    props.update      //force update count
*/

function SeriesSelector(props) {
  const size = {
    row: [12],
    layout:[2,10]
  };

  let [list, setList] = useState([]);

  const self = {
    clickSingle:(index_part,index_atom)=>{
      list[index_part][index_atom]=!list[index_part][index_atom];
      setList(tools.clone(list));
      self.updateSeries();
    },
    getArrayByLen:(n)=>{
      const arr=[];
      for(let i=0;i<n;i++){
        arr.push(false);
      }
      return arr;
    },
    getButtons:(n,rarity)=>{
      const arr=[];
      for(let i=0;i<n;i++){
        arr.push(rarity.includes(i));
      }
      return arr;
    },
    getRarityArray:(index)=>{
      const arr=list[index];
      const narr=[];
      for(let i=0;i<arr.length;i++){
        if(arr[i]===true) narr.push(i);
      }
      return narr;
    },
    updateSeries:()=>{
      //console.log(JSON.stringify(list));
      GENE.get(props.name, (dt) => {
        if(!dt || !dt.parts) return false;
        const parts=dt.parts;
        
        for(let i=0;i<parts.length;i++){
          if(!parts[i].rarity)parts[i].rarity=[];
          if(!parts[i].rarity[props.index])parts[i].rarity[props.index]=[];
          parts[i].rarity[props.index]=self.getRarityArray(i);
        }

        GENE.update.parts(props.name,parts,()=>{

        });
      });
    },
  }

  useEffect(() => {

    GENE.get(props.name, (dt) => {
      if(!dt || !dt.parts) return false;
      const arr=[];
      for(let i=0;i<dt.parts.length;i++){
        const part=dt.parts[i];
        const rarity_arr=!part.rarity[props.index]?[]:part.rarity[props.index];
        const btns=self.getButtons(part.value[2],rarity_arr);
        arr.push(btns);
      }
      setList(arr);
    });

  }, [props.name,props.index,props.update]);


  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Select the parts value to create series.</h5>
      </Col>
      {list.map((row, index) => (
      <Col className="pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
            #{index} Part
          </Col>
          <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
            {row.map((data, vkey) => (
              <button 
                key={vkey} 
                className={data===true?"btn btn-md btn-primary mr-5":"btn btn-md btn-secondary mr-5"}
                onClick={(ev)=>{
                  self.clickSingle(index,vkey);
                }}>{vkey}</button>
            ))}
          </Col>
        </Row>
      </Col>
      ))}
    </Row>
  );
}
export default SeriesSelector;