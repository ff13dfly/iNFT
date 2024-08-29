import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import AccountLoad from "./account_load";
import AccountGenerate from "./account_generate";

import tools from "../../lib/tools";

import { FaRegPlusSquare,FaUpload } from "react-icons/fa";

/* Adding account
*   @param  {number}    update        //fresh tag, force to fresh on this
*   @param  {function}  dialog        //system dialog 
*/

function AccountAdd(props) {
  const size = {
    row: [12],
    account: [6, 6],
  };
  
  const self={
    clickAdd:(ev)=>{
      if(props.dialog) props.dialog.show(<AccountGenerate dialog={props.dialog}/>,"Account Generator")
    },
    clickImport:(ev)=>{
      const network="anchor"
      if(props.dialog){
        props.dialog.show(<AccountLoad network={network} callback={()=>{

        }}/>,`Import Account ( ${tools.toUp(network)} Network )`)
      }
    },
  }

  useEffect(() => {
    
  }, [props.update]);

  return (
    <Row>
      <Col md={size.account[0]} lg={size.account[0]} xl={size.account[0]} xxl={size.account[0]}>
      </Col>
      <Col md={size.account[1]} lg={size.account[1]} xl={size.account[1]} xxl={size.account[1]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickAdd(ev);
        }}><FaRegPlusSquare size={18}/></button>
        <button className="btn btn-md btn-primary ml-5" onClick={(ev)=>{
          self.clickImport(ev);
        }}><FaUpload size={18}/></button>
      </Col>
    </Row>
  );
}
export default AccountAdd;