import { Row, Col } from "react-bootstrap";
import { useEffect, useState,useRef } from "react";
import { FaPlus } from "react-icons/fa";

import  Data from "../lib/data";
import  tools from "../lib/tools";

function Series(props) {

    const size = {
        row: [12],
        title:[8,4],
    };

    let [series,setSeries]=useState([]);

    const self={
        clickAdd:(ev)=>{
            const def=Data.get("NFT");
            if(def.series===undefined) def.series=[];

            //1.增加系列
            def.series.push({name:"",desc:""});
            const sum=def.series.length;

            //2.整理puzzle里的rarity的数据
            for(let i=0;i<def.puzzle.length;i++){
                if(!def.puzzle[i].rarity) def.puzzle[i].rarity=[];
                def.puzzle[i].rarity=self.getNewRarity(def.puzzle[i].rarity,sum)
            }

            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            props.fresh();
        },
        getNewRarity:(old,sum)=>{
            const result=[];
            for(let i=0;i<sum;i++){
                if(old!==undefined && old[i]!==undefined){
                    result.push(JSON.parse(JSON.stringify(old[i])));
                }else{
                    result.push([]);
                }
            }
            return result;
        },
    };

    useEffect(() => {

        const def=Data.get("NFT");
        if(def!==null){
            if(def.series===undefined) def.series=[];
            setSeries(def.series);
        }
        

    }, [props.update]);

    return (
        <Row>
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Series</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaPlus style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                    self.clickAdd(ev);
                }}/>
            </Col>
            {series.map((row, index) => (
                <Col key={index} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                    {JSON.stringify(row)}
                </Col>
            ))}
        </Row>
    )
}

export default Series;