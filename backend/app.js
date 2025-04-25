const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const defaultPort = 3000;
require('dotenv').config();//this activates the ability to parse the .env file



//automatically parse any incoming requests into a JSON format
app.use(express.json());
app.use(cors())

const {MongoClient, ServerApiVersion} = require('mongodb');


const DB_USERNAME = process.env.db_username;
const DB_PASSWORD = process.env.db_password;
console.log(DB_USERNAME)
console.log(DB_PASSWORD)

//put the uri here
const uri = "mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@filecluster.zuhvtjf.mongodb.net/?retryWrites=true&w=majority&appName=filecluster"

const client = new MongoClient(uri, {
    serverApi: {
        version:ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


//we will store all the user data in this database
const database = client.db('user-storage');

//we will store one collection for each user



async function run(){
    try{
        await client.connect();
        console.log("Connected to MongoDB");
        await client.db("admin").command({ping:1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally{
        //we don't want the connection to immediately close so we'll just pass for now.
        return;
    }
}

run().catch(console.dir);





// Set up multer storage configuration
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });


//this section here handles all sorts of crashes and server terminations so that Mongodb shuts off gracefully.

async function gracefulShutdown(){
    await client.close();
    console.log("We are gracefully shutting down the server and the mongodb connection");
}

process.on('SIGINT', async () => {
    console.log("Recieved SIGINT, shutting down gracefully...");
    await gracefulShutdown();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log("Recieved SIGTERM, shutting down gracefully...");
    await gracefulShutdown();
    process.exit(0);
});

//this will prevent dirty exit on code-fault crashes:
process.on('uncaughtException', async (err) => {
    console.error('Uncaught exception:', err);
    await gracefulShutdown();
    process.exit(1);
})

app.listen(defaultPort, () => {
    console.log(`Server is running on port ${defaultPort}`);
}
);

//=====================================================================================
//=====================================================================================
//=============================BOILER PLATE CODE ENDS HERE=============================
//=====================================================================================
//=====================================================================================



//this is where you can add your routes



//expected request .body:
// {
//     "username": "jimbob",
//     "unique_id": "2",
// }
//expected request .file:
// {
//     "pdfFile": <binary file>
// }


//this is the endpoint that will be used to upload the pdf file

app.post("/api/uploadFile",upload.single('file'),async (request,response)=>{
    if (!request.file) {
        return response.status(400).send('No file uploaded');
    }
    

    const requestBody = request.body;
    const requestUsername = requestBody.username;
    const requestUniqueID = Number(requestBody.unique_id);


    const requestFile = request.file;
    const requestFileBuffer = requestFile.buffer;
    const base64String = requestFileBuffer.toString('base64'); //this is the converted base64 string of the file
    

    const collection = database.collection("user-1");
    //We find the specific request object that has the same unique_id as the one in the request body
    const findUser = await collection.findOne({
        "username":requestUsername
    })
    
    

    await collection.updateOne(
        { _id: findUser._id,
            "doc_list.unique_id": requestUniqueID
         },
        {
            $set: {
                "doc_list.$.file": base64String,
                "doc_list.$.isRequested": false
            }
        }
    );

    response.status(200).send({
        message: 'PDF uploaded successfully!'
      });
    
})

//expected request body:
// {
//     "username": "user1",
//     "filetype": "HIPAA"
// }
//this is the endpoint that will be used to retrieve the pdf file


app.get("/api/getFiles",async (request,response)=>{

    //const requestFileType = request.headers["filetype"];//This defines if it is a HIPAA or a non-HIPAA file and so on and so forth.

    const requestUsername = request.headers["username"];
    const collection = await database.collection("user-1");

    

    const result = await collection.findOne(requestUsername);
    
    const result_doc_list = result.doc_list
    //const pdfBuffer = Buffer.from(base64String, 'base64');

    const fileArray = [];

    for (let i = 0; i < result_doc_list.length; i++ ){

        const base64String = result_doc_list[i].file;
        const pdfBuffer = Buffer.from(base64String, 'base64');

        const pdfFileName = result_doc_list[i].file_name;
        const pdfDescription = result_doc_list[i].description;
        const isRequested = result_doc_list[i].isRequested;
        const pdfDate = result_doc_list[i].due_date;
        const pdfFileType = result_doc_list[i].filetype;
        const unique_id = result_doc_list[i].unique_id;


        const miniPackage = {
            file_name: pdfFileName,
            file: pdfBuffer,
            description: pdfDescription,
            date:pdfDate,
            file_type: pdfFileType,
            isRequested: isRequested,
            unique_id: unique_id
        }

        fileArray.push(miniPackage);
    }


    response.status(200).send({
        message: 'PDF retrieved successfully!',
        files: fileArray,  // Send back file details
      });
})

app.post("/api/createUser",async (request,response)=>{

    const requestBody = request.body;
    response.status(200).send({
        message: 'User created successfully!'
      });
})