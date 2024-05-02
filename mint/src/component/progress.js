import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaIdBadge } from "react-icons/fa";

import Network from "../network/router";

function Progress(props) {
    const size = {
        row: [12],
        bar:[2,8,2],
        step:[1,2,2,1,2],
    };

    const format=[
        {name:"ancor_name",hash:"0x",now:6},
        {name:"ancor_name",hash:"0x",now:2},
        {name:"ancor_name",hash:"0x",now:0},
        {name:"ancor_name",hash:"0x",now:0},
        {name:"ancor_name",hash:"0x",now:0},
    ]

    let [list,setList]=useState([]);

    const self={
        clickSingle:(name,hash)=>{
            console.log(name,hash);
        },
        getStatus:(order,now)=>{
            if(now===0) return "pt-3 waiting";
            if(order===now) return "pt-3 going";
            if(order<now) return "pt-3 done";
            return "pt-3 waiting";
        },
    }

    useEffect(() => {
        setList(format);
        Network("tanssi").subscribe("progress",(bk, bhash)=>{
            //format[1].now++;
            //setList(JSON.parse(JSON.stringify(format)));
        });

    }, [props.update]);

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>10 mint, 4 done.</Col>
            {list.map((row, index) => (  
            <Col key={index} className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                        <h5>#{index+1}</h5>
                    </Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className={self.getStatus(0,row.now)} sm={size.step[0]} xs={size.step[0]}></Col>
                            <Col className={self.getStatus(1,row.now)} sm={size.step[1]} xs={size.step[1]}></Col>
                            <Col className={self.getStatus(2,row.now)} sm={size.step[2]} xs={size.step[2]}></Col>
                            <Col className={self.getStatus(3,row.now)} sm={size.step[3]} xs={size.step[3]}></Col>
                            <Col className={self.getStatus(4,row.now)} sm={size.step[4]} xs={size.step[4]}></Col>
                            <Col className={self.getStatus(5,row.now)}></Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                        <button hidden={row.now<6} className="btn btn-sm btn-secondary" onClick={(ev)=>{
                            self.clickSingle(row.name,row.hash);
                        }}><FaIdBadge /></button>
                    </Col>
                </Row>
            </Col>
            ))}

            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Info: every mint takes about 36 seconds to finalize.
            </Col>
        </Row>
    )
}

export default Progress;