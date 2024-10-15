import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import { FcPuzzle,FcWorkflow,FcProcess,FcSettings,FcRules,FcBullish } from "react-icons/fc";

import Template from "./template";
import Bounty from "./bounty";
import Market from "./market";
import Minting from "./minting/list_minting";
import Setting from "./setting";
import Document from "./document";

function Grid(props) {
    const size = {
        grid: [4],
    };

    const dialog=props.dialog;
    const self={
        clickTemplate:(ev)=>{
            props.panel.hide();
            // props.panel.callback(()=>{
            //     props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            // });
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />,"Gene Template");
        },
        clickBounty:(ev)=>{
            props.panel.hide();
            props.panel.callback(()=>{
                props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            });
            dialog(<Bounty fresh={props.fresh} dialog={props.dialog} panel={props.panel}/>,"Bounty");
        },
        clickMarket:(ev)=>{
            props.panel.hide();
            props.panel.callback(()=>{
                props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            });
            dialog(<Market fresh={props.fresh} dialog={props.dialog} panel={props.panel}/>,"Market");
        },
        clickMinting:(ev)=>{
            props.panel.hide();
            // props.panel.callback(()=>{
            //     props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            // });
            dialog(<Minting fresh={props.fresh} dialog={props.dialog} panel={props.panel}/>,"Minting");
        },
        clickSetting:(ev)=>{
            props.panel.hide();
            // props.panel.callback(()=>{
            //     props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            // });
            dialog(<Setting fresh={props.fresh} dialog={props.dialog} panel={props.panel}/>,"Setting");
        },
        clickDocument:(ev)=>{
            props.panel.hide();
            // props.panel.callback(()=>{
            //     props.panel.show(<Grid dialog={props.dialog} panel={props.panel}/>)
            // });
            dialog(<Document fresh={props.fresh} dialog={props.dialog} panel={props.panel}/>,"Document");
        },
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcWorkflow className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickBounty(ev);
                }}/>
                <h6 className="pt-2">Bounty</h6>
            </Col>
            <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcProcess className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickMarket(ev);
                }}/>
                <h6 className="pt-2">Market</h6>
            </Col>
            <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcPuzzle className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickTemplate(ev);
                }}/>
                <h6 className="pt-2">Gene Template</h6>
            </Col>
            {/* <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcBullish className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickMinting(ev);
                }}/>
                <h6 className="pt-2">Minting</h6>
            </Col> */}
            <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcSettings className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickSetting(ev);
                }}/>
                <h6 className="pt-2">Setting</h6>
            </Col>
            {/* <Col className="pt-2 text-center" sm={size.grid[0]} xs={size.grid[0]}>
                <FcRules className="grid_icon bg-secondary" size={75} onClick={(ev)=>{
                    self.clickDocument(ev);
                }}/>
                <h6 className="pt-2">Document</h6>
            </Col> */}
        </Row>
    )
}

export default Grid;