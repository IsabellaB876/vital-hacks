import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const textractClient = new TextractClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: fromCognitoIdentityPool({
    identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
    clientConfig: { region: process.env.NEXT_PUBLIC_AWS_REGION },
  }),
});

export const analyzeDocumentFromBuffer = async (fileBuffer) => {
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
};