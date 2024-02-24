import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Local from "../lib/local";
import  Chain from "../lib/chain";
import  Data from "../lib/data";
import Render from "../lib/render";

function Template(props) {
    const size = {
        row: [12],
        add: [8,4],
        detail: [9,3],
    };

    let [list, setList]=useState([]);
    let [alink, setAlink]= useState("anchor://");
    let [image,setImage]=useState("image/empty.png");

    const zero="0x0000000000000000000000000000000000000000000000000000000000000000";
    
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
            if(alinks.length===0) return ck && ck();
            const single=alinks.pop();
            if(!Data.exsistHash("cache",single)){
                return Chain.read(single,(res)=>{
                    const key=`${res.location[0]}_${res.location[1]}`;
                    console.log(res.data[key]);
                    res.data[key].raw=JSON.parse(res.data[key].raw);
                    Data.setHash("cache",single,res.data[key]);
                    return self.cacheData(alinks,ck);
                });
            }else{
                return self.cacheData(alinks,ck);
            }
        },
    }

    const dom_id="pre_image";
    useEffect(() => {
        const tpls=Local.get("template");
        const nlist=!tpls?[]:JSON.parse(tpls);
        
        const arr=[];
        for(let i=0;i<nlist.length;i++){
            arr.push(nlist[i].alink);
        }

        self.cacheData(arr,()=>{
            const last=[]
            for(let i=0;i<nlist.length;i++){

                nlist[i].data=Data.getHash("cache",nlist[i].alink);
                last.push(nlist[i]);
            }
            setList(last);

            setTimeout(()=>{
                const pen = Render.create(dom_id);
                const row=last[0];
                const dt=row.data.raw;
                //console.log(row);

                const basic = {
                    cell: dt.cell,
                    grid: dt.grid,
                    target: dt.size
                }
                Render.clear(dom_id);
                Render.preview(pen,dt.image,zero,dt.parts,basic);
                //const ctx=pen.getContext("experimental-webgl",{preserveDrawingBuffer:true});
                const bs=pen.canvas.toDataURL("image/jpeg");
                setImage(bs);
            },200);
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
                <canvas hidden={true} width={400} height={400} id={dom_id}></canvas>
            </Col>
            {list.map((row, index) => (
                <Col className="pt-2" key={index} sm={size.row[0]} xs={size.row[0]}>
                    <div className="limited" style={{height:"200px"}}>
                        <Row className="pb-4">
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Alink: <strong>{row.alink}</strong> <br/>
                                {row.data.raw.parts.length} parts.
                            </Col>
                            <Col sm={size.detail[0]} xs={size.detail[0]}>
                                <img className="template" src={image} alt="" />
                            </Col>
                            <Col sm={size.detail[1]} xs={size.detail[1]}>
                                <Row>
                                    <Col className="text-end" sm={size.row[0]} xs={size.row[0]}>
                                        <button className="btn btn-md btn-primary">Try</button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            ))}
        </Row>
    )
}

export default Template;