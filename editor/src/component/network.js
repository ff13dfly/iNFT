import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Network(props) {
    const size = {
        row: [12],
        opt:[2,2,1,7],
    };

    const nets=["anchor","btc","eth"];
    let [net,setNet] =useState(nets);

    const router={
        anchor:()=>{

        },
        eth:()=>{

        },
        btc:()=>{

        },
    }

    const self={
        upFirst:(string)=>{
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        router:(name)=>{
            if(!router[name]) return false;
            router[name]();
        },
    }

    useEffect(() => {

    }, []);

    return (
        <Row className="pt-2">
            <Col className="text-left" lg={size.opt[0]} xl={size.opt[0]} xxl={size.opt[0]} >
                <h3>iNFT Editor</h3>
            </Col>
            <Col lg={size.opt[1]} xl={size.opt[1]} xxl={size.opt[1]} >
                <select className="form-control">
                    {net.map((row, index) => (
                        <option key={index} value={row} onClick={(ev)=>{
                            self.router(row);
                        }}>{self.upFirst(row)} Network</option>
                    ))}
                </select>
            </Col>
            <Col className="text-end" lg={size.opt[2]} xl={size.opt[2]} xxl={size.opt[2]} >
                <button className="btn btn-small btn-primary">Check</button>
            </Col>
            <Col className="pt-2" lg={size.opt[3]} xl={size.opt[3]} xxl={size.opt[3]} >
                12,343,453 0x123fad33d..dd123adcca
            </Col>
        </Row>
    )
}

export default Network;