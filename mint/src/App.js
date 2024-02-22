import { Container,Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import Preview from "./component/render";
import Action from "./component/action";
import Header from "./component/header";
// iNFT definition
// anchor://aabb/217148

function App() {

  const size = {
    row: [12],
    side:[6,3,3],
  };

  let [show,setShow]=useState(false);
  let [title,setTitle]=useState("");
  let [content,setContent]=useState("");

  const self={
    dialog:(ctx,title)=>{
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
  }

  useEffect(() => {
       
  }, []);
  
  return (
    <div>
      <Container>
        <Header />
        <Preview />
        <Action />
      </Container>

      <Modal show={show} size="lg"
        onHide={(ev) => { setShow(false); }}
        centered={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {content}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
