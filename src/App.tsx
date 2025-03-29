// App.tsx
import React, { useState, useCallback } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { analyzeDocumentFromBuffer } from "./lib/textract";

// Define types for the Textract result
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

// Document Validator Component (formerly ProxyValidator.tsx)
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
    const textBlocks = textractResult.Blocks.filter(
      (block) => block.BlockType === "LINE"
    );
    const documentText = textBlocks.map((block) => block.Text || "").join(" ").toLowerCase();

    // Define the keywords to check for
    const keywords = [
      { keyword: "Massachusetts Health Care Proxy", label: "Massachusetts Health Care Proxy" },
      { keyword: "Health Care Agent", label: "Health Care Agent" },
    ];

    keywords.forEach(({ keyword, label }) => {
      if (!documentText.includes(keyword.toLowerCase())) {
        missing.push(label);
      }
    });

    // Check for signature (placeholder logic)
    const hasSignature = checkForSignature(textractResult.Blocks);
    if (!hasSignature) {
      missing.push("Signature");
    }

    return missing;
  };

  // Placeholder signature-checking logic
  const checkForSignature = (blocks: TextractBlock[]): boolean => {
    // You would implement your actual signature detection here.
    return false;
  };

  // Placeholder date-checking logic
  const checkForDate = (documentText: string): boolean => {
    // Implement your date validation logic here.
    return true;
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Tax Clearance Certificate Checker
      </h1>

      <div
        {...getRootProps()}
        className="dropzone"
        style={{
          border: "2px dashed #007bff",
          padding: "30px",
          textAlign: "center",
          borderRadius: "8px",
          background: "#f8f9fa",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p style={{ color: "#007bff" }}>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
      </div>

      {file && (
        <p style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>
          Uploaded File: {file.name}
        </p>
      )}

      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>
          Validating document...
        </div>
      )}

      {documentAccepted && missingFields.length === 0 && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#d4edda",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", color: "#155724" }}>Document Accepted!</h2>
          <p style={{ color: "#155724" }}>
            Your document has passed all checks and is deemed valid.
          </p>
        </div>
      )}

      {!documentAccepted && missingFields.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          {missingFields.length >= 4 && (
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "1rem",
                backgroundColor: "yellow",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              ERROR: This document is likely NOT a tax clearance certificate
            </div>
          )}
          <h2 style={{ fontSize: "1.4rem", color: "#d9534f" }}>Missing Fields:</h2>
          <ul>
            {missingFields.map((field, index) => (
              <li key={index} style={{ color: "#d9534f" }}>
                {field === "Date must be within the last 6 months"
                  ? "Date not provided or is not within the last 6 months"
                  : `${field} is missing or invalid`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Combined App component that renders the NavBar and Document Validator
const App: React.FC = () => {
  return (
    <Container>
      <NavBar />
      <DocumentValidator />
    </Container>
  );
};

export default App;
