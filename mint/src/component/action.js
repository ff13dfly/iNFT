import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Action(props) {
    const size = {
        row: [12],
    };

    const self={
        clickMint:(ev)=>{
            console.log(`Ready to mint an iNFT.`);
            //1.检测是否有账号

            //2.检测账号的余额

            //3.准备数据，开始写入
        },
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <div id="footer">
            <Row>
                <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                    <button className="btn btn-lg btn-primary" onClick={(ev)=>{
                        self.clickMint(ev);
                    }}>Mint Now!</button>
                </Col>
            </Row>
        </div>
    )
}

export default Action;