import express from "express";
import cors from "cors";
import dialogflow from '@google-cloud/dialogflow';
import gcHelper from "google-credentials-helper"
import { WebhookClient, Card, Suggestion, Image, Payload } from 'dialogflow-fulfillment';
import mongoose from 'mongoose'
import Cookies from 'universal-cookie'
import {v4 as uuid} from 'uuid'


const cookies = new Cookies()

if(cookies.get('userID')=== undefined){

    cookies.set('userID', uuid(), {path:'/'})
}
console.log(cookies.get('userID'))

mongoose.connect("mongodb+srv://raheel:baig8911@cluster0.bmry1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
gcHelper();
const sessionClient = new dialogflow.SessionsClient()

const app = express();
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 7001;

app.post("/api/df_text_query", async (req, res) => {
const projectId = "rbstarhotel-lgab"
const sessionId = req.body.sessionId || "session123"
const text = req.body.text;
const languageCode = "en-US"
const event = req.body.event


    console.log("query: ", text, req.body);

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: languageCode,
            },
        },
    };
    try {
        const responses = await sessionClient.detectIntent(request);
        // console.log("responses: ", responses);
        // console.log("resp: ", responses[0].queryResult.fulfillmentText);    
        res.send(
             responses[0].queryResult
        );

    } catch (e) {
        console.log("error while detecting intent: ", e)
    }
})
app.post("/api/df_event_query", async (req, res) => {

const projectId = "rbstarhotel-lgab"
const sessionId = req.body.sessionId || "session123"
const query = req.body.text;
const languageCode = "en-US"
const event = req.body.event

    console.log("query: ", event, req.body);

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: event,
                // The language used by the client (en-US)
                languageCode: languageCode,
              },
        },
    };
    try {
        const responses = await sessionClient.detectIntent(request);
        // console.log("responses: ", responses);
        // console.log("resp: ", responses[0].queryResult.fulfillmentText);    
        res.send(
            responses[0].queryResult
        );

    } catch (e) {
        console.log("error while detecting intent: ", e)
    }
})



        const OrderSchema = new mongoose.Schema({
            userID:String,
            room: String,
            date: String,
        })
        
        const Order = mongoose.model('Order',OrderSchema)
        
        
        app.post("/",async (req,res)=>{
            const userID = cookies.get('userID')
        
            const agent = new WebhookClient({request:req, response:res});
            
        
            function bookRoom(agent){
                Order.findOne({userID:userID},function(err,user){
                    if(user==null){
                        const orders = new Order({
                            userID:userID,
                            room:agent.parameters.roomType,
                            date:agent.parameters.date
                        })
                        orders.save()
                        console.log("Room Booked ");
                    }else{
        
                        Order.updateOne({userID:userID},{room:agent.parameters.roomType,date:agent.parameters.date},function(err){
                            if (err){
                                console.log(err);
                            }else{
                                console.log("Room Booked");
                            }
                        })
                    }
                })
                let responseText = `your order is ${agent.parameters.roomType} room on ${agent.parameters.date} thank you for visit.`
                agent.add(responseText)
            }
            let intentMap = new Map();
            intentMap.set('bookRoom',bookRoom)
        
            agent.handleRequest(intentMap)
        })
        
        

        
        


app.get("/profile", (req, res) => {
    res.send("here is your profile");
})
app.get("/about", (req, res) => {
    res.send("some information about me");
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});