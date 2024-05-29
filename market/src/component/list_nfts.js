import { Row,Col,Card,Placeholder } from 'react-bootstrap';
import { useEffect,useState } from "react";

import TPL from "../lib/tpl";

function ListNFTs(props) {
  const size = {
    row: [12],
    grid:[3],
  };

  let [list,setList]=useState([]);
  let [ready,setReady]=useState(false);

  const self={
    getHolder:(n)=>{
      const arr=[]
      for(let i=0;i<n;i++){
        arr.push({name:"fake_"+i});
      }
      return arr;
    },
    getTemplates:(list,ck)=>{
      //1.filter out all template cid
      const map={};
      for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row && row.raw && row.raw.tpl) map[row.raw.tpl]=true;
      }

      //get cid array
      const tpls=[];
      for(var cid in map) tpls.push(cid);
      TPL.cache(tpls,ck);
    },
  }

  useEffect(() => {
    const nlist=self.getHolder(props.data.length);
    setList(nlist);

    self.getTemplates(props.data,()=>{
      setReady(true);
    });

  }, [props.data]);

  return (
    <Row>
      {list.map((row, index) => (
        <Col className="justify-content-around pt-2" key={index}  lg={size.grid[0]} xxl={size.grid[0]} md={size.grid[0]}>
          
          <Card hidden={!ready} style={{ width: '100%' }}>
              <a href={`/view/${row.name}`}>
                <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
              </a>
              <Card.Body>
                <Card.Title>iNFT Name</Card.Title>
                <Card.Text>
                  Desc about the iNFT.
                </Card.Text>
              </Card.Body>
            
          </Card>

          <Card hidden={ready} style={{ width: '100%' }}>
            <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default ListNFTs;