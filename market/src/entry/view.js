import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect,useState ,useContext} from "react";
import { useParams } from "react-router-dom";

import Header from "../component/common_header";
import PriveiwINFT from "../component/inft_preview";
import DetailINFT from "../component/inft_detail";
import PartsINFT from "../component/inft_parts";

import source from '../lib/provider';

function View(props) {

    let { anchor } = useParams();
    const { sharedData,Network,TPL } = useContext(source);

    const size = {
        row: [12],
        header: [5, 7]
    };

    let [data,setData] = useState();

    const self = {
        getAnchor:(name,ck)=>{
            Network("anchor").view({name:name},'anchor',(dt)=>{
                if(!dt) return ck && ck(false);
                return ck && ck(dt);
            });
        }
    }

    useEffect(() => {
        self.getAnchor(anchor,(res)=>{
            if(!res) return false;
            console.log(res);
            setData(res);
            
            TPL.view(res.raw.tpl,(dt)=>{
                console.log(dt);

            });
        });
    }, [props.update]);

    return (
        <div>
            <Header active={"market"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]}  xxl={size.row[0]} >
                        <Breadcrumb>
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href={`/market/${!props.page?1:props.page}`}>Market</Breadcrumb.Item>
                            <Breadcrumb.Item active>iNFT</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                        <PriveiwINFT id={"iNFT_view"} hash={"0x"}/>
                        {/* <PartsINFT /> */}
                        {sharedData}
                    </Col>
                    <Col md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                       <DetailINFT data={data}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default View;