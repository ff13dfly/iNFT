import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import SOL from "../network/solana";

function Solana(props) {
    const size = {
        row: [12],
    };

    const self={
        clickWrite:(ev)=>{
            //console.log(window.phantom);
            SOL.wallet((signer)=>{
                // SOL.airdrop(signer.publicKey,3,(res)=>{
                //     console.log(res);
                // },"devnet");

                const data={
                    target:"hello world",
                    stamp:0,
                };

                SOL.storage(data,(txHash)=>{
                    console.log(txHash);
                },signer,"devnet");
            });
        },
    };

    useEffect(() => {
        
        
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickWrite(ev)
                }}>Write</button>
            </Col>
        </Row>
    )
}

export default Solana;