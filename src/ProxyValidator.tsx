// DocumentValidator.tsx

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeDocumentFromBuffer } from "../lib/textract";

// Example interface if you have a structured return type:
interface TextractBlock {
  Id?: string;
  BlockType?: string;
  Text?: string;
  EntityTypes?: string[];
  Relationships?: {
    Type: string;
    Ids: string[];
  }[];
}

interface TextractResult {
  Blocks: TextractBlock[];
}

const DocumentValidator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [documentAccepted, setDocumentAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    const fileArrayBuffer = await uploadedFile.arrayBuffer();
    const fileBuffer = new Uint8Array(fileArrayBuffer);

    try {
      setIsLoading(true);
      const textractResult = (await analyzeDocumentFromBuffer(fileBuffer)) as TextractResult;

      const missing = checkForKeywords(textractResult);
      setMissingFields(missing);
      setDocumentAccepted(missing.length === 0);
    } catch (error) {
      console.error("Error processing document:", error);
      setMissingFields(["Error analyzing document."]);
      setDocumentAccepted(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const checkForKeywords = (textractResult: TextractResult): string[] => {
    const missing: string[] = [];
    const textBlocks = textractResult.Blocks.filter((block) => block.BlockType === "LINE");
    const documentText = textBlocks.map((block) => block.Text || "").join(" ").toLowerCase();

    // Example keywords
    const keywords = [
      { keyword: "State of New Jersey", label: "State of New Jersey" },
      { keyword: "Clearance Certificate", label: "Clearance Certificate Keyword" },
      { keyword: "Philip D. Murphy", label: "Governor's Name" },
    ];

    keywords.forEach(({ keyword, label }) => {
      if (!documentText.includes(keyword.toLowerCase())) {
        missing.push(label);
      }
    });

    // Check for signature
    const hasSignature = checkForSignature(textractResult.Blocks);
    if (!hasSignature) {
      missing.push("Signature");
    }

    // Check date within 6 months
    const dateIsValid = checkForDate(documentText);
    if (!dateIsValid) {
      missing.push("Date must be within the last 6 months");
    }

    return missing;
  };

  const checkForSignature = (blocks: TextractBlock[]): boolean => {
    // your signature logic...
    return false; // placeholder
  };

  const checkForDate = (documentText: string): boolean => {
    // your date logic...
    return true; // placeholder
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
      <h1>Tax Clearance Certificate Checker</h1>
      <div {...getRootProps()} style={{ border: "2px dashed #007bff", padding: "30px" }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop a file here, or click to select a file</p>}
      </div>
      {/* The rest of your UI logic, e.g. missing fields, etc. */}
    </div>
  );
};

export default DocumentValidator;
