import { Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import RowHash from "./row_hash";
import RowPart from "./row_part";

//show the hash used by iNFT.

let from="";
let to="";

function Hash(props) {
    const size = {
        row: [12],
    };

    const config={
        single:16,              //single char width
        grid:16,                //the amount of a row
        warning:"#ffc107",      //warning color
        animation:3000,         //slide in animation total time
    };

    let [list, setList]=useState([]);

    const self={
        //convert single string hash to render structure.
        toArray:(hash,step)=>{
            const len=hash.length;
            const page=Math.ceil(len/step);
            const data={
                section:[],
                group:[],
                color:[],
            }

            for(let i=0;i<page;i++){
                const start=i*step;
                const end=start+step;
                const color=hash.slice(len-6,len);
                data.section.push(hash.slice(start,end));
                data.group.push(Array(step).fill(0))
                data.color.push(Array(step).fill(`#${color}`));
            }
            return data;
        },

        //tag the part position in group array
        calcPosition:(group,parts,step)=>{
            for(let i=0;i<parts.length;i++){
                const [start,offset]=parts[i].value;
                const row=Math.floor(start/step);
                const line=start%step;
                const index=i+1;
                for(let j=0;j<offset;j++){
                    //FIXME, here to calc the end situation
                    group[row][line+j]=index;
                }
            }
            return group;
        },
        //tag the used value of hash
        calcColor:(color,group,warn_color)=>{
            for(let i=0;i<group.length;i++){
                for(let j=0;j<group[i].length;j++){
                    if(group[i][j]!==0) color[i][j]=warn_color;
                }
            }
            return color;
        },
        //prepare the list for React rendering.
        group:(matrix)=>{
            const arr=[];
            for(let i=0;i<matrix.group.length;i++){
                arr.push(
                    {
                        group:matrix.group[i],
                        section:matrix.section[i],
                        color:matrix.color[i],
                    }
                )
            }
            return arr;
        },

        //convert the interval to ats;

        speed:(n,step)=>{
            const single=parseInt(n/step);
            return Array(step).fill(single);
        },

        fresh:()=>{
            const pure= props.hash.slice(2);
            const matrix=self.toArray(pure,config.grid);
            const tpl=Data.get("template");
            if(tpl!==null){
                matrix.group=self.calcPosition(matrix.group,tpl.parts,config.grid); 
                matrix.color=self.calcColor(matrix.color,matrix.group,config.warning);
            }

            const nlist=self.group(matrix);
            setList(nlist);
        },
    }

    useEffect(() => {
        self.fresh();

    }, [props.update,props.hash]);

    return (
        <Row className="unselect">
            {list.map((row, index) => (
                <div key={index}>
                    <RowHash color={row.color} data={row.section}/>
                    <RowPart group={row.group} data={row.section}/>
                </div>
            ))}
            {/* <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                80<span className="text-warning">8f</span>9fa6d081ed02
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"34px"}}>#0</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                335d0cb5d481<span className="text-warning">cf</span>81
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"195px"}}>#5</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                d2bb38<span className="text-warning">38</span>382dfd33
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"98px"}}>#1</Badge>
            </Col>
            <Col className="hash" sm={size.row[0]} xs={size.row[0]}>
                265<span className="text-warning">19</span>55138<span className="text-warning">7c</span>1a2e
            </Col>
            <Col className="part" sm={size.row[0]} xs={size.row[0]}>
                <Badge style={{marginLeft:"50px"}}>#2</Badge>
                <Badge style={{marginLeft:"84px"}}>#3</Badge>
            </Col> */}
        </Row>
    )
}

export default Hash;