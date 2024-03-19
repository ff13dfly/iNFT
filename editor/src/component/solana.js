import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Solana(props) {
    const size = {
        row: [12],
    };

    const self={
        clickWrite:(ev)=>{
            //1.connect to "devnet"
            // const {Connection,clusterApiUrl} =  window.solanaWeb3;
            // const connection = new Connection(clusterApiUrl('devnet'));

            //2.connect to localhost
            const solana=window.solanaWeb3;
            const uri="http://127.0.0.1:8899";
            const connection = new solana.Connection(uri, "confirmed");
            if (typeof window.solana !== 'undefined') {
                console.log('Phantom wallet is installed and connected');
                try {
                    window.solana.connect().then((res)=>{
                        console.log(res.publicKey.toString());
                        //console.log(`Sleep 2s to recall.`);
                        connection.getSignaturesForAddress(res.publicKey,{limit:10}).then((msg)=>{
                            console.log(msg);
                        });
                    });

                } catch (error) {
                    
                }
            } else {
                // Phantom wallet extension is not installed or not connected
                console.log('Phantom wallet is not installed or not connected');
            }
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