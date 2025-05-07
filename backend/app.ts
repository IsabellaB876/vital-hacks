const defaultPort = 3000;
import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import cors from 'cors';
import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';//this activates the ability to parse the .env file

dotenv.config();
const app = express();


//automatically parse any incoming requests into a JSON format
app.use(express.json());
app.use(cors())




const DB_USERNAME: string = process.env.db_username || '';
const DB_PASSWORD: string = process.env.db_password || '';
console.log(DB_USERNAME)
console.log(DB_PASSWORD)

//put the uri here
const uri:string = "mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@filecluster.zuhvtjf.mongodb.net/?retryWrites=true&w=majority&appName=filecluster"

const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version:ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


//we will store all the user data in this database
const database:Db = client.db('user-storage');

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
const storage:multer.StorageEngine = multer.memoryStorage();

const upload:Multer = multer({ storage: storage });


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
//     "file": <binary file>
// }


//this is the endpoint that will be used to upload the pdf file

app.post("/api/uploadFile", upload.single('file'), async (request, response) => {
    try {
        if (!request.file) {
            response.status(400).send('No file uploaded');
            return;
        }

        const requestBody:any = request.body;
        const requestUsername: string = requestBody.username;
        const requestUniqueID:number = Number(requestBody.unique_id);

        const requestFile:any = request.file;
        const requestFileBuffer:Buffer = requestFile.buffer;
        const base64String:string = requestFileBuffer.toString('base64'); // this is the converted base64 string of the file

        const collection:Collection<any> = database.collection("user-1");
        // We find the specific request object that has the same unique_id as the one in the request body
        const findUser:any | null = await collection.findOne({
            "username": requestUsername
        });

        await collection.updateOne(
            {
                _id: findUser._id,
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
//this is the endpoint that will be used to retrieve all the files for a specific user


app.get("/api/getFiles",async (request,response)=>{

    //const requestFileType = request.headers["filetype"];//This defines if it is a HIPAA or a non-HIPAA file and so on and so forth.

    const requestUsername:string | string[] | undefined = request.headers["username"];
    const collection = await database.collection("user-1");

    

    const result:any | null = await collection.findOne({username:requestUsername});
    
    
    const result_doc_list: any = result.doc_list
    //const pdfBuffer = Buffer.from(base64String, 'base64');

    const fileArray: any[] = [];

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
        message: 'Files retrieved successfully!',
        files: fileArray,  // Send back file details
      });
})


//expected request body:
// {
//     "username": "jimbob",
//     "file_name": "newfile.pdf",
//     "description": "this is a new file",
//     "filetype": "HIPAA",
//     "due_date": "2023-10-01",

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
