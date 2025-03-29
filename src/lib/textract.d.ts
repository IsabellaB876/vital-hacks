// textract.d.ts
import { AnalyzeDocumentCommandOutput } from "@aws-sdk/client-textract";

/**
 * Analyzes a document from the provided file buffer.
 * @param fileBuffer A Uint8Array representing the document file.
 * @returns A promise that resolves with the AnalyzeDocumentCommandOutput from AWS Textract.
 */
export declare function analyzeDocumentFromBuffer(
    fileBuffer: Uint8Array
): Promise<AnalyzeDocumentCommandOutput>;