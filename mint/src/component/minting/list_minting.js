import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import INFT from "../../system/inft";
import { FaRegWindowClose } from "react-icons/fa";

/* List the minting iNFTs on target block
*   @param  {array}     fresh      //iNFT[], iNFT list
*   @param  {number}    block      //update number, force to fresh
*   @param  {function}  dialog     //system dialog function
*   @param  {number}    [limit]     //show max number of iNFTs
*/

function ListMinting(props) {
    const size = {
        row: [12],
        grid:[4],
    };

    let [list, setList]=useState([]);

    const self={
        getLimitList:(arr)=>{
            const max=props.limit?(arr.length>=props.limit?props.limit:arr.length):arr.length;
            const narr=[]
            for(let i=0;i<max;i++){
                narr.push(arr[i]);
            }
            return narr;
        },
        getGridFromList:(arr,ck,map)=>{
            if(map===undefined) map=[];
            if(arr.length===0) return ck && ck(map);
            const row=arr.pop();
            INFT.single.thumb(row.name,row.raw,row.hash,(bs64)=>{
                row.thumb=bs64;
                map.push(row);
                return self.getGridFromList(arr,ck,map);
            });
        },
    }

    useEffect(() => {
        //console.log(props);
        if(props.data.length!==0){
            const narr=self.getLimitList(props.data);
            self.getGridFromList(narr,(infts)=>{
                setList(infts);
            })
        } 
    }, [props.data,props.block]);

    return (
        <Row className="pb-2">
            <Col className="pt-2 text-center" sm={size.row[0]} xs={size.row[0]}>
                Minting list to show.
            </Col>
            {list.map((row, index) => (
            <Col key={index} className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <img alt="" src={row.thumb} className="series_thumb pointer"/>
                {row.name}
            </Col>
            ))}
        </Row>
    )
}

export default ListMinting;