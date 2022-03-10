import React, { useEffect, useState } from 'react'
import {Modal,Button ,Form,Row,Col,Container,Card} from 'react-bootstrap'
import './Chatbot.css'
import imgurl from './send blue.png'
import axios from 'axios'
import Messages from './Messages' 
import ReactScroll from 'react-scrollable-feed'
import { v4 as uuid } from 'uuid';
import Cookies from "universal-cookie";



const cookies = new Cookies();


function Chatbot (props){
  const [messages,setMessages] = useState([])
  const [intmsgs,setIntmsgs] = useState('')


  async function df_text_query(textQuery) {
  
      let says = {
        speaks: "me",
        msg: {
          platform :"PLATFORM_UNSPECIFIED",
          text: {
            text: textQuery
          }
        }
      };
      setMessages((pre)=>{return[...pre,says]})
      const res = await axios.post('https://chatbot2practice.herokuapp.com/api/df_text_query',{text:textQuery});
      for(let msg of res.data.fulfillmentMessages){
        console.log(JSON.stringify(msg));
         says={
          speaks : 'bot',
          msg:msg
              
            
          
        }
        setMessages((pre)=>{return[...pre,says]})


      }
  }
  async function df_event_query(eventQuery) {

      
      const res = await axios.post('https://chatbot2practice.herokuapp.com/api/df_event_query',{event:eventQuery });
      console.log("Data===================>",res.data.fulfillmentMessages)
      for(let msg of res.data.fulfillmentMessages){
        let says={
          speaks : 'bot',
          msg:msg
              
           
          
        }
        setMessages((pre)=>{return[...pre,says]})
        console.log("State1============>",messages);
      }
  }
  useEffect(()=>{
    df_event_query('welcome')
    if(cookies.get('userID') === undefined) {
    cookies.set('userID', uuid(), {path: '/'})
  }
  console.log(cookies.get('userID'));
  }
    ,[])



    // const renderOneMsgs = (messages,i)=>{
      

    //     return 
    //   }else if(messages.msg && messages.msg.text.text.payload.fields ){
    //     for(let i=0 ;i<=messages.length;i++){

    //       return(<Card    />)
    //     }
        
    //   }else{
    //     return <h2>ye lo</h2>
    //   }
    // }

  const renderMessages=(stateMessages)=>{
    console.log("State=============>",messages);
    if(stateMessages){
      return( stateMessages.map((messages, i)=>{
        if(messages?.msg?.platform === "PLATFORM_UNSPECIFIED" && messages?.msg?.payload){
            return messages.msg.payload.fields.richContent.listValue.values.map((v,i)=>{
              console.log(v);
            return(
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={v.listValue?.values[0]?.structValue?.fields?.rawUrl?.stringValue}/>
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
                <Button onClick={(e)=>handleCardbtn(e, v.listValue.values[1].structValue.fields.options.listValue.values[0].structValue.fields.text.stringValue)} variant="primary">{v.listValue.values[1].structValue.fields.options.listValue.values[0].structValue.fields.text.stringValue}</Button>
              </Card.Body>
            </Card>
            
          )
          })
             
        }else if(messages?.msg && messages?.msg?.text?.text && messages?.msg?.platform === "PLATFORM_UNSPECIFIED"){
          return <Messages key={i} speaks={messages.speaks} text={messages.msg.text.text} />
        }
      }

      ))
      
    }
    else{
      return <h1>Hello</h1>
  }
  }

  const handleInput=(e)=>{
    setIntmsgs(e.target.value)
  }
  const handleBtn=(e)=>{
    console.log(e);
    if(e.type === 'click'){

      df_text_query(intmsgs)
      setIntmsgs('')
    }else if(e.key === 'Enter'){
      df_text_query(intmsgs)
      setIntmsgs('')
    }
  }
  const handleCardbtn=(e,v)=>{
    if(e.type === 'click'){
       console.log(e,v);
      df_text_query(v)
      setIntmsgs('')
    }
  }
        
        return(
            <div>

            <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Shopping Chatbot
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='chat_body'>
      {/* <Messages speaks={messages.speaks} text={messages.msg.text.text} /> */}
        <div className='chat_div'>
      <ReactScroll>


        {renderMessages(messages) }
      </ReactScroll>
        </div>
 
      </Modal.Body>
      <Modal.Footer>
      <Container>
  <Row>
    <Col>
    <Form.Control type="text" className='no_de in' value={intmsgs} autoFocus placeholder='Ask Anything...' onChange={(e)=>{handleInput(e)} } onKeyPress={(e)=>handleBtn(e)}/>
    
   
  
    </Col>
    <Col xs lg="2" className='no_de'>
        <Button type='submit' className='butn'><img src={imgurl} className='img' onClick={(e)=>handleBtn(e)}/></Button>
    
    </Col>
  </Row>
</Container>
   



 

      </Modal.Footer>
    </Modal>
        </div>
            // <div>ChatBOT</div>
        )
    
        }

export default Chatbot 