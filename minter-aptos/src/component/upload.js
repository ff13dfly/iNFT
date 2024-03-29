import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";

function Upload(props) {
    const size = {
        row: [12],
        upload:[7,5],
    };

    const self = {
        clickUpload:(ev)=>{

        },
        changeDef:(ev)=>{
            try {
                const fa = ev.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                  try {
                    const fa = JSON.parse(e.target.result);

                    //console.log(fa);
                    Data.set("template", fa);
                    props.fresh();

                    //1.加载NFT的定义
                    // const NFT={
                    //     puzzle:fa.parts,
                    //     series:fa.series,
                    // }
                    // Data.set("NFT",NFT);

                    // //2.加载图像文件
                    // if(fa.image){
                    //     Data.set("template",fa.image);
                    // }

                    // //3.更新基本参数
                    // const imp_size={
                    //     cell:fa.cell,
                    //     grid:fa.grid,
                    //     target:fa.size,
                    // };
                    // Data.set("size",imp_size);

                    // props.fresh();
                  } catch (error) {
                    
                  }
                };
                reader.readAsText(fa);
            } catch (error) {
            
            }
        },
    }
    useEffect(() => {

    }, [props.update]);

    return (
        <Row>
            <Col className="" sm={size.upload[0]} xs={size.upload[0]}>
                <small>For debug, upload iNFT definition</small>
                <input className="form-control" 
                    type="file" accept="application/JSON" placeholder="The iNFT definition." onChange={(ev)=>{
                    self.changeDef(ev);
                }}/>
            </Col>
            {/* <Col className="pt-2 text-end" sm={size.upload[1]} xs={size.upload[1]}>
                <button className="btn btn-md btn-primary" onClick={(ev) => {
                    self.clickUpload(ev);
                }}>Upload</button>
            </Col> */}
        </Row>
    )
}

export default Upload;