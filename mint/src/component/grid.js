import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import { FaList,FaPizzaSlice,FaPuzzlePiece } from "react-icons/fa";

import Template from "./template";

function Grid(props) {
    const size = {
        grid: [4],
    };

    const dialog=props.dialog;
    const self={
        clickTemplate:(ev)=>{
            props.panel.hide();
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />,"Template");
        },
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPuzzlePiece className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Gene Template</h6>
            </Col>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPizzaSlice className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Bounty</h6>
            </Col>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPizzaSlice className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Market</h6>
            </Col>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPizzaSlice className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Mint Board</h6>
            </Col>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPizzaSlice className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Setting</h6>
            </Col>
            <Col className="pt-4 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FaPizzaSlice className="pointer" size={45} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-4">Document</h6>
            </Col>
        </Row>
    )
}

export default Grid;