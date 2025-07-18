const defaultPort = 3000;
const jwt = require('jsonwebtoken');
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
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());


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


const ACCESS_TOKEN_LIFETIME = '15m';
const REFRESH_TOKEN_LIFETIME = '30d'; // 30 days
const ACCESS_TOKEN_MAX_AGE_MS = 1000 * 60 * 15;
//this is where you can add your routes

//expected request body:
// {
//     "username": "jimbob",
//     "id": 1
//     "edits": []


//json object for edits:
// {
//     "key": "this is a string and is the name of the property that you want to edit",
//     "value": "this is the new value that you want to set it to, it can be whatever value you want"

app.patch("/api/editFile",async (request, response) => {

    try {
        const collection = await database.collection("user-1");

        const requestBody = request.body;
        const requestUsername = requestBody.username;
        const requestID = Number(requestBody.id);
        const requestEdits = requestBody.edits;
        

        const findUser = await collection.findOne({
            "username": requestUsername
        });

        if (!findUser) {
            console.log("user not found");
            throw new Error("user not found!");
        }


        for (const edit in requestEdits) {
            const key = requestEdits[edit].key;
            const value = requestEdits[edit].value;
            
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
    } catch (error) {
        console.error('Error editing file:', error);
        response.status(500).send('Internal server error');
    }

});


//expected request .body:
// {
//     username: "jimbob",
//     edits:[]
// }

//json object for edits:
// {
//     "key": "this is a string and is the name of the property that you want to edit",
//     "value": "this is the new value that you want to set it to, it can be whatever value you want"

app.patch("/api/editUser",async (request, response)=>{
    try{
        const collection = await database.collection("user-1");

        const requestBody = request.body;
        const requestUsername = requestBody.username;
        const requestEdits = requestBody.edits;

        const findUser = await collection.findOne({
            "username": requestUsername
        });

        if (!findUser) {
            console.log("user not found");
            throw new Error("user not found!");
        }

        for (const edit in requestEdits) {
            const key = requestEdits[edit].key;
            const value = requestEdits[edit].value;
            
            const update = {
                $set: {
                    [`${key}`]: value
                }
            };
            await collection.updateOne(
                {
                    _id: findUser._id
                },
                update
            );
            console.log(`Updated ${key} to ${value}`);
        }
        response.status(200).send({
            message: 'File edited successfully!'
        });
    } catch (error) {
        console.error('Error editing file:', error);
        response.status(500).send('Internal server error');
    }
})


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

        if (!findUser) {
            console.log("user not found");
            throw new Error("user not found!");
        }

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


//expected request .body:
// {
//     username: "jimbob"
// }
//expected request .file:
// {
 //   "file": <binary file>
// }
app.patch("/api/uploadPhoto", upload.single('file'), async (request, response) => {
    try {
        if (!request.file) {
            response.status(400).send('No file uploaded');
            return;
        }
        const requestBody = request.body;
        const requestUsername = requestBody.username;
        const requestPhoto = request.file;
        const collection = database.collection("user-1");

        // We find the specific request object that has the same unique_id as the one in the request body
        const findUser = await collection.findOne({
            "username": requestUsername
        });

        if (!findUser) {
            console.log("user not found");
            throw new Error("user not found!");
        }

        const requestFileBuffer = requestPhoto.buffer;
        const base64String = requestFileBuffer.toString('base64'); // this is the converted base64 string of the file

        await collection.updateOne(
            {
                _id: findUser._id
            },
            {
                $set: {
                    "photo": base64String
                }
            }
        );

        response.status(200).send({
            message: 'Photo uploaded successfully!'
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
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
//
// user: {
    //     firstName: "Joshua",
    //     lastName: "Paulino Ozuna",
    //     username: "joshypooh17",
    //     role: "Patient",
    //     birthDate: "2000-01-01",
    //     files: [
    //         {
    //             name: "file1.pdf",
    //             file: <binary file>,
    //             description: "this is a new file",
    //             date: "2023-10-01",
    //             type: "HIPAA"
    //         },
    //         {
    //             name: "file2.pdf",
    //             file: <binary file>,
    //             description: "this is another new file",
    //             date: "2023-10-02",
    //             type: "non-HIPAA"
    //         }
    //     ]
// }
//This is going to be transmutated into a File Object in the frontend
//this is the endpoint that will be used to retrieve all the files for a specific user


// gets everything in relation to a user by their username
app.get("/api/getUser",async (request,response)=>{

    //const requestFileType = request.headers["filetype"];//This defines if it is a HIPAA or a non-HIPAA file and so on and so forth.

    try {
        console.log(request.headers)
        const requestUsername = request.headers["username"];
        const collection = await database.collection("user-1");

        const result = await collection.findOne({username:requestUsername});

        if (!result) {
            console.log("user not found");
            throw new Error("user not found!");
        }
        
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

        const base64StringPhoto = result.photo;
        const pdfBufferPhoto = Buffer.from(base64StringPhoto, 'base64');


        response.status(200).send({
            message: 'User Object retrieved successfully!',
            user: {
                firstName: result.firstName,
                lastName: result.lastName,
                username: result.username,
                password:result.password,
                role: result.role,
                birthDate: result.birthDate,
                files:fileArray,
                users: result.users, // This is the array of users that the user has requested files from
                photo: base64StringPhoto // This is the user's photo in base64 format
            }
        });
    } catch (error) {
        console.error('Error getting user: ', error);
        response.status(500).send ({
            message: 'Internal error when getting user'
        })
    }
})


//expected request body:
// {
//     "username": "jimbob",
//     "requester_username": "joshypooh17",
//     "request_attributes": {
//         "name": "newfile.pdf",
//         "description": "this is a new file",
//         "date": "2023-10-01",
//         "type": "HIPAA"
//     }

app.post("/api/createRequest",async (request,response)=>{

    try {
        const requestBody = request.body;
        const requestAttributes = requestBody.request_attributes;

        const requestUsername = requestBody.username;
        const requestFileName = requestAttributes.name;
        const requestDescription = requestAttributes.description;
        const requestFileType = requestAttributes.type;
        const requestDueDate = requestAttributes.date;

        const collection = await database.collection("user-1");
        const result = await collection.findOne({username:requestUsername});
        const findUser = await collection.findOne({
            "username": requestUsername
        });

        if (!result) {
            console.log("result: user not found");
            throw new Error("result: user not found!");
        }

        if (!findUser) {
            console.log("findUser: user not found");
            throw new Error("findUser: user not found!");
        }

        await collection.updateOne(
            {
                _id: findUser._id
            },
            {
                $push: {
                    "files": {
                        "name": requestFileName,
                        "description": requestDescription,
                        "file": "",
                        "due_date": requestDueDate,
                        "type": requestFileType,
                        "isRequested": true,
                        "id": result.files.length + 1,
                        "requestedBy": requestBody.requester_username,
                        "requestedFor": requestBody.username
                    }
                }
            }
        );


        response.status(200).send({
            message: 'Request created successfully!'
        });
    } catch (error) {
        console.error('Error creating request: ', error);
        response.status(500).send ({
            message: 'Internal error when creating request'
        })
    }
})

// gets everything except files in case of security issues
app.get("/api/getUserPublic",async (request,response)=>{
    try {
        const requestUsername = request.headers["username"];
        const collection = await database.collection("user-1");

        const result = await collection.findOne({username:requestUsername});

        if (!result) {
            console.log("user not found");
            throw new Error("user not found!");
        }
        
        console.log(result);

        response.status(200).send({
            message: `${requestUsername} retrieved successfully!`,
            user: {
                firstName: result.firstName,
                lastName: result.lastName,
                username: result.username,
                password:result.password,
                role: result.role,
                birthDate: result.birthDate,
                users: result.users, // This is the array of users that the user has requested files from
                photo: result.photo, // This is the user's photo in base64 format
            }
      });
    } catch (error) {
        console.error('Error getting public user: ', error);
        response.status(500).send ({
            message: 'Internal error when getting public user'
        })
    }
})



/*
expected request body:
{
    "role": "Patient"
    "firstName": "Joshua"
    "lastName": "Paulino Ozuna"
    "username": "joshypooh17"
    "password": "mEdVaUlT*2025"
    "birthDate": "2000/01/01"
}
*/

app.post('/api/createAccount', async (request, response) => {

    try {
        const requestBody = await request.body;
        console.log(request.get('Content-Type'));

        const requestRole = requestBody.role;
        const requestFirstName = requestBody.firstName;
        const requestLastName = requestBody.lastName;
        const requestUsername = requestBody.username;
        const requestPassword = requestBody.password;
        const requestBirthDate = requestBody.birthDate;

        const collection = await database.collection("user-1");

        // Check if username already exists
        const existingUser = await collection.findOne({ username: requestUsername });

        if (existingUser != null) {
            response.status(409).send({
                message: 'Username already exists!'
            });
            return;
        }

        if (requestRole == null || requestFirstName == null || requestLastName == null 
            || requestUsername == null || requestPassword == null || requestBirthDate == null) {
                response.status(400).send({
                    message: "Missing required fields!"
                });
                return;
            }

        // Create new user document
        const newUser = {
            role: requestRole,
            firstName: requestFirstName,
            lastName: requestLastName,
            username: requestUsername,
            password: requestPassword,
            birthDate: requestBirthDate,
            files: [],
            users:[],
            photo: "", // Initialize with an empty string or a default photo
        };

        await collection.insertOne(newUser);

        

        response.status(200).send({
            message: 'Account created successfully!'
        });
    } catch (error) {
        console.error('Error creating account: ', error);
        response.status(500).send ({
            message: 'Internal error when creating account'
        });
        return;
    }
});


/*
not tested
expected request body:
{
   username:"jimbob",
   password:"password"
}
*/
app.post("/api/generateAccessToken", async(request,response)=>{
    try{
        const requestBody = request.body
        const requestUsername = requestBody.username
        const requestPassword = requestBody.password

        const collection = await database.collection("user-1");

        const existingUser = await collection.findOne({ username: requestUsername });
        console.log(existingUser)

        const databasePassword = existingUser.password;
        if (databasePassword !== requestPassword){
            throw new Error("Invalid Username or Password.")
        }

        // Create a token that expires in 1 hour
        const access_token = jwt.sign(
            { username: requestUsername,
                password: existingUser.password
             },      // The payload
            process.env.ACCESS_SECRET, //we set the access key here
            { expiresIn: '15m' }      
        );

        response.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: ACCESS_TOKEN_MAX_AGE_MS //matches the JWT's lifetime
        });

        response.status(200).send({
            message: 'Access Token generated successfully!'
        });
    } catch (error) {
        console.error('Error generating access token: ', error);
        response.status(500).send ({
            message: 'Internal error when generating access token'
        });
        return;
    }
})
//No required  requestBody, we extract directly from the user's cookies.
//not tested
app.get("/api/verifyAccessToken", async(request,response)=>{
    const accessToken = request.cookies.accessToken;
    
    if (!accessToken){
        return response.status(401).send({ message: "No access token found." });
    }

    try {
        const decoded = jwt.verify(accessToken,process.env.ACCESS_SECRET)

        response.status(200).send({
            message: "Access token verified.",
            username: decoded.username,
            password: decoded.password
        })




    }catch (error) {
        response.status(401).send({ message: "Invalid or expired access token." });
    }
})