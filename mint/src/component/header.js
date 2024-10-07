import { Row, Col,Dropdown, DropdownButton } from "react-bootstrap";
import { useEffect } from "react";
import { FaList, FaRegUser, FaGripHorizontal,FaBuffer } from "react-icons/fa";
import { FcPuzzle,FcWorkflow,FcProcess,FcSettings,FcRules,FcBullish } from "react-icons/fc";

import Grid from "./grid";
import Account from "./account";
import Template from "./template";
import Mine from "./mine";

import Bounty from "./bounty";
import Market from "./market";
import Setting from "./setting";

function Header(props) {
    const size = {
        row: [12],
        title: [2, 7, 3]
    };

    const dialog = props.dialog;
    const self = {
        clickMine: (ev) => {
            dialog(<Mine fresh={props.fresh} dialog={props.dialog} />, "My iNFT List");
        },
        clickTemplate: (ev) => {
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />, "Template");
        },
        clickAccount: (ev) => {
            dialog(<Account fresh={props.fresh} dialog={props.dialog} />, "Account Management");
        },

        clickPanel: (ev) => {
            props.panel.show(<Grid dialog={props.dialog} panel={props.panel} />)
        },
        clickBounty:(ev)=>{
            dialog(<Bounty  dialog={props.dialog}/>,"Bounty");
        },
        clickMarket:(ev)=>{
            dialog(<Market  dialog={props.dialog} />,"Market");
        },
        clickSetting:(ev)=>{
            dialog(<Setting  dialog={props.dialog} />,"Market");
        },
    }
    useEffect(() => {

    }, [props.update]);

    return (
        <Row className="pt-4">
            {/* <Col sm={size.title[0]} xs={size.title[0]}>
                <FaGripHorizontal className="pointer" size={26} onClick={(ev) => {
                    self.clickPanel(ev);
                }} />
            </Col> */}
            <Col sm={size.title[0]} xs={size.title[0]}>
                <DropdownButton
                    id={`dropdown-variants-secondary`}
                    variant={"secondary"}
                    title={""}
                >
                    <Dropdown.Item className="pt-2" onClick={(ev)=>{
                        self.clickBounty(ev);
                    }}>
                        <FcWorkflow size={24}/><span className="ml-10">Bounty</span> 
                    </Dropdown.Item>
                    <Dropdown.Item className="pt-2" onClick={(ev)=>{
                        self.clickMarket(ev);
                    }}>
                        <FcProcess size={24}/><span className="ml-10">Market</span>
                    </Dropdown.Item>
                    
                    <Dropdown.Item></Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="pt-2" onClick={(ev)=>{
                        self.clickTemplate(ev);
                    }}>
                        <FcPuzzle size={24}/><span className="ml-10">Template</span>
                    </Dropdown.Item>
                     <Dropdown.Divider />
                    <Dropdown.Item className="pt-2" onClick={(ev)=>{
                        self.clickSetting(ev);
                    }}>
                        <FcSettings size={24}/><span className="ml-10">Setting</span>
                    </Dropdown.Item>
                </DropdownButton>
            </Col>

            <Col className="pt-1" sm={size.title[1]} xs={size.title[1]}>
                <h3>iNFT Minter</h3>
            </Col>
            <Col className="pt-1 text-end" sm={size.title[2]} xs={size.title[2]}>
                {/* <FaPizzaSlice className="pointer" size={26} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/> */}

                <FaList className="pointer" size={26} onClick={(ev) => {
                    self.clickMine(ev);
                }} />
                <FaRegUser className="pointer" size={26} style={{ marginLeft: "15px" }} onClick={(ev) => {
                    self.clickAccount(ev);
                }} />
            </Col>
        </Row>
    )
}

export default Header;