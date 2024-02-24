import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Local from "../lib/local";

function Template(props) {
    const size = {
        row: [12],
        add: [8,4],
    };

    let [list, setList]=useState([]);
    let [alink, setAlink]= useState("anchor://");

    

    const self = {
        changeAlink:(ev)=>{
            setAlink(ev.target.value.trim());
        },
        clickAdd:(ev)=>{
            console.log(`Add a template`);
            const tpls=Local.get("template");
            const nlist=!tpls?[]:JSON.parse(tpls);
            nlist.unshift({
                alink:alink,
                name:"",
                tags:[]
            });
            Local.set("template",JSON.stringify(nlist));
            setList(nlist);
        },
        cacheData:(alinks,ck)=>{


            return ck && ck(true);
        },
    }

    useEffect(() => {
        const tpls=Local.get("template");
        const nlist=!tpls?[]:JSON.parse(tpls);
        
        const arr=[];
        for(let i=0;i<nlist.length;i++){
            arr.push(nlist[i].alink);
        }

        self.cacheData(arr,()=>{
            setList(nlist);
        });

        

    }, [props.update]);

    return (
        <Row>
            <Col sm={size.add[0]} xs={size.add[0]}>
                <input className="form-control" type="text" placeholder="The template anchor link" value={alink} onChange={(ev)=>{
                    self.changeAlink(ev);
                }}/>
            </Col>
            <Col className="text-end" sm={size.add[1]} xs={size.add[1]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickAdd(ev);
                }}>Add</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            {list.map((row, index) => (
                <Col key={index} sm={size.row[0]} xs={size.row[0]}>
                    {JSON.stringify(row)}
                </Col>
            ))}
        </Row>
    )
}

export default Template;