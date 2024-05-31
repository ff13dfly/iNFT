import { Row,Col,Card,Placeholder } from 'react-bootstrap';
import { useEffect,useState } from "react";

import TPL from "../lib/tpl";
import Render from '../lib/render';
import tools from '../lib/tools';

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
        arr.push({name:"#"+i});
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
    getThumbs:(list,ck,imgs)=>{
      if(imgs===undefined){
        list=tools.copy(list);
        imgs={}
      }
      if(list.length===0) return ck && ck(imgs);
      const row=list.pop();
      TPL.view(row.raw.tpl,(def)=>{
        const basic = {
            cell: def.cell,
            grid: def.grid,
            target: def.size
        }
        const offset=!row.raw.offset?[]:row.raw.offset;
        Render.thumb(props.hash,def.image,def.parts,basic,offset,(img)=>{
          imgs[row.name]=img;
          return self.getThumbs(list,ck,imgs)
        });
      })
    },
    formatResult:(list,imgs)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        arr.push({
          name:row.name,
          signer:row.signer,
          bs64:imgs[row.name],
        });
      }
      return arr;
    },
    showThumb:(bs64)=>{
      if(!bs64) return `${window.location.origin}/imgs/logo.png`;
      return bs64;
    },
  }

  useEffect(() => {
    const nlist=self.getHolder(props.data.length);
    setList(nlist);

    self.getTemplates(props.data,(res)=>{
      self.getThumbs(props.data,(imgs)=>{
        const narr=self.formatResult(props.data,imgs);
        setList(narr)
        setReady(true);
      });
    });
  }, [props.data]);

  return (
    <Row>
      {list.map((row, index) => (
        <Col className="justify-content-around pt-2" key={index}  lg={size.grid[0]} xxl={size.grid[0]} md={size.grid[0]}>
          
          <Card hidden={!ready} style={{ width: '100%' }}>
              <a href={`/view/${row.name}`}>
                <Card.Img variant="top" src={self.showThumb(row.bs64)} />
              </a>
              <Card.Body>
                <Card.Title>{row.name}</Card.Title>
                <Card.Text>
                  {!row.owner?"":tools.shorten(row.owner)}
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