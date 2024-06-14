import { Row,Col,Card,Placeholder } from 'react-bootstrap';
import { useEffect,useState } from "react";

import Network from '../network/router';
import TPL from '../lib/tpl';
import Render from '../lib/render';

function ListMarket(props) {
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
    getAnchors:(ans,ck,map)=>{
      if(map===undefined) map={};
      if(ans.length===0) return ck && ck(map);
      const row=ans.pop();
      return Network("anchor").view({name:row.name},"anchor",(data)=>{
        if(!data || !data.name) return self.getAnchors(ans,ck,map)
        map[data.name]=data;
        return self.getAnchors(ans,ck,map);
      });
    },
    getTemplates:(map)=>{
      const alinks=[];
      for(var k in map){
        const row=map[k];
        const raw=row.raw;
        if(raw.tpl && !alinks.includes(raw.tpl)) alinks.push(raw.tpl);
      }
      return alinks;
    },
  }

  useEffect(() => {
    Network("anchor").market((arr)=>{
      const nlist=self.getHolder(arr.length);
      setList(nlist);

      self.getAnchors(arr,(full)=>{
        const alinks=self.getTemplates(full);
        TPL.cache(alinks,(dels)=>{



        });
      });
    });
  }, [props.update]);

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
export default ListMarket;