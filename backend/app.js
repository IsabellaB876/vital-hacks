const defaultPort = 3000;

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv'); // this activates the ability to parse the .env file


dotenv.config();
const app = express();


//automatically parse any incoming requests into a JSON format
app.use(express.json());
app.use(cors())


const DB_USERNAME = process.env.db_username || '';
const DB_PASSWORD = process.env.db_password || '';

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

//expected request body:
// {
//     "username": "jimbob",
//     "id": 1
//     "edits": {}


//json object for edits:
// {
//     "key": "this is a string and is the name of the property that you want to edit",
//     "value": "this is the new value that you want to set it to, it can be whatever value you want"

app.patch("/api/editFile",async (request, response) => {

    const collection = database.collection("user-1");


    const requestBody = request.body;
    const requestUsername = requestBody.username;
    const requestID = Number(requestBody.id);
    const requestEdits = requestBody.edits;

    const findUser = await collection.findOne({
        "username": requestUsername
    });


    for (const edit in requestEdits) {
        const key = edit.key;
        const value = edit.value;
        const update = {
            $set: {
                [`files.$.${key}`]: value
            }
        };
        await collection.updateOne(
            {
                _id: findUser._id,
                "files.id": requestID
            },
            update
        );
        console.log(`Updated ${key} to ${value}`);
    }

    response.status(200).send({
        message: 'File edited successfully!'
    });

});


//expected request .body:
// {
//     username: "jimbob",
//     id: 1
// }
//expected request .file:
// {
//     "file": <binary file>
// }


//this is the endpoint that will be used to upload the pdf file

app.patch("/api/uploadFile", upload.single('file'), async (request, response) => {
    try {
        if (!request.file) {
            response.status(400).send('No file uploaded');
            return;
        }

        const requestBody = request.body;
        const requestUsername = requestBody.username;
        const requestUniqueID = Number(requestBody.id);

        const requestFile = request.file;
        const requestFileBuffer = requestFile.buffer;
        const base64String = requestFileBuffer.toString('base64'); // this is the converted base64 string of the file

        const collection = database.collection("user-1");
        // We find the specific request object that has the same unique_id as the one in the request body
        const findUser = await collection.findOne({
            "username": requestUsername
        });

        await collection.updateOne(
            {
                _id: findUser._id,
                "files.id": requestUniqueID
            },
            {
                $set: {
                    "files.$.file": base64String,
                    "files.$.isRequested": false
                }
            }
        );

        response.status(200).send({
            message: 'File uploaded successfully!'
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        response.status(500).send('Internal server error');
    }
});

//expected request header:
// {
//     "username": "jimbob"
// }
//This request header is used to identify the user that is making the request, a special case where we NEED for the get api request
//For this case only we will not be using the request body and therefore not the entirety of the User Object.

//returns an array of JSON objects with the following format:
// {
//     "name": "newfile.pdf",
//     "file": <binary file>,
//     "description": "this is a new file",
//     "date": "2023-10-01",
//     "type": "HIPAA",
//     "isRequested": true,
//     "id": 1
// }
//This is going to be transmutated into a File Object in the frontend
//this is the endpoint that will be used to retrieve all the files for a specific user


app.get("/api/getFiles",async (request,response)=>{

    //const requestFileType = request.headers["filetype"];//This defines if it is a HIPAA or a non-HIPAA file and so on and so forth.

    const requestUsername = request.headers["username"];
    const collection = await database.collection("user-1");

    

    const result = await collection.findOne({username:requestUsername});
    
    
    const result_doc_list = result.files
    //const pdfBuffer = Buffer.from(base64String, 'base64');

    const fileArray = [];

    for (let i = 0; i < result_doc_list.length; i++ ){

        const base64String = result_doc_list[i].file;
        const pdfBuffer = Buffer.from(base64String, 'base64');

        const pdfFileName = result_doc_list[i].name;
        const pdfDescription = result_doc_list[i].description;
        const isRequested = result_doc_list[i].isRequested;
        const pdfDate = result_doc_list[i].due_date;
        const pdfFileType = result_doc_list[i].type;
        const unique_id = result_doc_list[i].id;
        const requestedBy = result_doc_list[i].requestedBy;
        const requestedFor = result_doc_list[i].requestedFor;


        const miniPackage = {
            name: pdfFileName,
            file: pdfBuffer,
            description: pdfDescription,
            date:pdfDate,
            type: pdfFileType,
            isRequested: isRequested,
            id: unique_id,
            requestedBy: requestedBy,
            requestedFor: requestedFor
        }

        fileArray.push(miniPackage);
    }


    response.status(200).send({
        message: 'Files retrieved successfully!',
        files: fileArray,  // Send back file details
      });
})


//expected request body:
// {
//     The user as a JSON object
//     The file as a JSON object

app.post("/api/createRequest",async (request,response)=>{

    const requestBody = request.body;

    const requestUsername = requestBody.username;
    const requestFileName = requestBody.file_name;
    const requestDescription = requestBody.description;
    const requestFileType = requestBody.filetype;
    const requestDueDate = requestBody.due_date;


    response.status(200).send({
        message: 'Request created successfully!'
      });
})

/*
expected request body:
{
    "role": "Patient"
    "firstName": "Joshua"
    "lastName": "Paulino Ozuna"
    "username": "joshypooh17"
    "password": "mEdVaUlT*2025"}
*/

app.post('/api/createAccount', async (request, response) => {

    const requestBody = request.body;

    const requestRole = requestBody.role;
    const requestFirstName = requestBody.firstName;
    const requestLastName = requestBody.lastName;
    const requestUsername = requestBody.username;
    const requestPassword = requestBody.password;

    response.status(200).send ({
        message: 'Account created successfully!'
    });
})

// route to get a user from their username and password
app.get('/api/login', async (request, response) => {
    const username = request.headers["username"];
    const password = request.headers["password"];

    if ( !username || !password ) {
        return response.status(400).send( {
            message: 'Username and password are required'
        });
    }

    const collection = database.collection ("user-1");

    const userData = await collection.findOne({
        username: username,
        password: password
    });

    response.status(200).send({
        message: 'Login successful',
        user: userData
    })
})