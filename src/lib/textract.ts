// textract.ts
import {
  TextractClient,
  AnalyzeDocumentCommand,
  AnalyzeDocumentCommandOutput,
} from "@aws-sdk/client-textract";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// Create the Textract client using Cognito Identity Pool credentials
const textractClient = new TextractClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION!, // non-null assertion if you know it's set
  credentials: fromCognitoIdentityPool({
    identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID!,
    clientConfig: { region: process.env.NEXT_PUBLIC_AWS_REGION! },
  }),
});

// Function to analyze a document buffer
export async function analyzeDocumentFromBuffer(
  fileBuffer: Uint8Array
): Promise<AnalyzeDocumentCommandOutput> {
  try {
    const params = {
      Document: {
        Bytes: fileBuffer,
      },
      FeatureTypes: ["FORMS", "TABLES", "SIGNATURES"],
    };

    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);
    return response;
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
}
