import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import Local from "../lib/local";
import Render from "../lib/render";

function Mine(props) {
    const size = {
        row: [12],
        list:[6],
    };

    let [list,setList] = useState([]);

    const self = {
        page:(arr,page,step)=>{
            console.log(arr);
            const nlist=[];
            const max=arr.length;
            if((page-1)*step>max) return nlist;
            for(let i=0;i<step;i++){
                const key=(page-1)*step+i;
                if(arr[key]!==undefined)nlist.push(arr[key]);
            }
            return nlist;
        },
    }

    useEffect(() => {
        const ls=Local.get("list");
        if(ls!==undefined){
            try {
                const nlist=JSON.parse(ls);
                const plist=self.page(nlist,1,10);
                setList(plist);
            } catch (error) {
                
            }
        }
    }, [props.update]);

    return (
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                My iNFT list.
            </Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.list[0]} xs={size.list[0]}>
                    {row.link}
                </Col>
            ))}
        </Row>
    )
}

export default Mine;