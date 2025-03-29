'use client';

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeDocumentFromBuffer } from "../lib/textract";

export default function Home() {
  const [file, setFile] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [documentAccepted, setDocumentAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    const fileArrayBuffer = await uploadedFile.arrayBuffer();
    const fileBuffer = new Uint8Array(fileArrayBuffer);

    try {
      setIsLoading(true);
      const textractResult = await analyzeDocumentFromBuffer(fileBuffer);

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
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
  });

  const checkForKeywords = (textractResult) => {
    const missing = [];
    const textBlocks = textractResult.Blocks.filter(block => block.BlockType === 'LINE');
    const documentText = textBlocks.map(block => block.Text).join(" ").toLowerCase();

    // Check for keywords
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

    // Check for date (must be within past 6 months)
    const dateIsValid = checkForDate(documentText);
    if (!dateIsValid) {
      missing.push("Date must be within the last 6 months");
    }

    return missing;
  };

  // Existing signature check
  const checkForSignature = (blocks) => {
    const signatureBlocks = blocks.filter(block => block.BlockType === 'SIGNATURE');
    if (signatureBlocks.length > 0) return true;

    const signatureEntities = blocks.filter(block => block.EntityTypes?.includes('SIGNATURE'));
    if (signatureEntities.length > 0) return true;

    const formFields = blocks.filter(block =>
      block.BlockType === 'KEY_VALUE_SET' &&
      block.EntityTypes?.includes('KEY')
    );

    const signatureField = formFields.some(field => {
      const childBlocks = blocks.filter(block =>
        field.Relationships?.some(rel =>
          rel.Type === 'CHILD' && rel.Ids.includes(block.Id)
        )
      );

      const fieldText = childBlocks
        .map(block => block.Text?.toLowerCase() || '')
        .join(' ');

      return fieldText.includes('signature') || fieldText.includes('signed');
    });

    return signatureField;
  };

  // Date Checking Logic
  const checkForDate = (documentText) => {
    const datePattern = /(\d{1,2}[/-]\d{1,2}[/-]\d{4})/g;
    const matches = documentText.match(datePattern);

    if (!matches || matches.length === 0) {
      return false;
    }

    const dateStr = matches[0];
    const normalized = dateStr.replace(/-/g, "/");
    const parsedDate = new Date(normalized);

    if (isNaN(parsedDate.getTime())) {
      return false;
    }

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    return parsedDate >= sixMonthsAgo && parsedDate <= now;
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

      {/* Loading Indicator */}
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>
          Validating document...
        </div>
      )}

      {/* Document Acceptance Notification */}
      {documentAccepted && missingFields.length === 0 && (
        <div style={{ marginTop: "2rem", backgroundColor: "#d4edda", padding: "1rem", borderRadius: "6px" }}>
          <h2 style={{ fontSize: "1.4rem", color: "#155724" }}>Document Accepted!</h2>
          <p style={{ color: "#155724" }}>
            Your document has passed all checks and is deemed valid.
          </p>
        </div>
      )}

      {/* List any missing fields */}
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
                borderRadius: "4px"
              }}
            >
              ERROR: This document is likely NOT a tax clearance certificate
            </div>
          )}
          <h2 style={{ fontSize: "1.4rem", color: "#d9534f" }}>Missing Fields:</h2>
          <ul>
            {missingFields.map((field, index) => {
              if (field === "Date must be within the last 6 months") {
                return (
                  <li key={index} style={{ color: "#d9534f" }}>
                    Date not provided or is not within the last 6 months
                  </li>
                );
              }
              return (
                <li key={index} style={{ color: "#d9534f" }}>
                  {field} is missing or invalid
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
