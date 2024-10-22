import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import INFT from "../../system/inft";

/* iNFT minting list
*   @param  {string}    props.uuid                //unique name
*   @param  {string}    [props.template]           //template cid
*   @param  {number}    [props.amount]             //amount to show, default=4
*   @param  {number}    [props.grid]              //cell grid for react
*/

function Minting(props) {
  const size = {
    row: [12],
    grid: [3],
    right: [4, 8],
  };

  let [list, setList] = useState([{ bs64: `${window.location.origin}/imgs/logo.png` }]);
  let [info, setInfo] = useState("");

  const self = {
    filterINFTs: (arr, cid) => {
      const full = [];
      const limit = !props.amount ? 4 : props.amount
      for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
        if(!cid){
          full.push(row);
        }else{
          if (row.raw.tpl === cid) {
            full.push(row);
          }
        }
        if (full.length === limit) return full;
      }
      return full;
    },
    calcGrid:()=>{
      if(!props.grid) return size.grid[0];
      return props.grid;
    },
  }


  useEffect(() => {
    const chain = Network("anchor");
    chain.subscribe(`minting_${props.uuid}`, (block, hash) => {
      chain.view(hash, "detail", (infts) => {
        if (infts.length === 0) {
          setList([{bs64: `${window.location.origin}/imgs/logo.png` }]);
          return setInfo(`0 iNFT on block ${block.toLocaleString()}`);
        }
        const arr = self.filterINFTs(infts, props.template);

        for (let i = 0; i < arr.length; i++) {
          arr[i].block = block;
        }

        INFT.auto(arr, (fs) => {
          setInfo(`${infts.length} iNFTs on block ${block.toLocaleString()}`);
          if (fs.length === 0) {
            return setList([{ bs64: `${window.location.origin}/imgs/logo.png` }]);
          }
          setList(fs);
        });
      });
    });
  }, [props.uuid]);

  return (
    <Row>
      <Col md={size.right[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
        <h5>Minting</h5>
      </Col>
      <Col className="text-end" md={size.right[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
        {info}
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          {list.map((row, index) => (
            <Col 
              className="pt-2 box" 
              key={index} 
              md={self.calcGrid()} 
              lg={self.calcGrid()} 
              xl={self.calcGrid()} 
              xxl={self.calcGrid()}
            >
              <Image
                src={row.bs64}
                rounded
                width="100%"
                style={{ border: "1px solid #EEEEEE" }}
              />
            </Col>
          ))} 
        </Row>
      </Col>
    </Row>
  );
}
export default Minting;