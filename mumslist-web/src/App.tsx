import React, { useState, useMemo, useEffect } from "react";
import "./App.css";
import { Input } from "components";
import { API, FileClient } from "api";
import styled from "@emotion/styled";

interface FileIndexWithContents {
  index: number;
  contents?: string;
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileIndexWithContents[]>([]);

  // Downloads

  async function downloadAllFiles(indexes?: number[]) {
    const newFiles: FileIndexWithContents[] = [];
    const reader = new FileReader();
    const indexesToUse = indexes ?? files.map(file => file.index);
    for (let index of indexesToUse) {
      const fileContents = await FileClient.downloadFile(index);
      reader.onload = () => {
        newFiles.push({
          index,
          contents: typeof reader.result === "string" ? reader?.result : ""
        });
      };
      reader.readAsText(fileContents);
    }
    return newFiles;
  }

  useEffect(() => {
    (async () => {
      const indexes = await API.files.getFileIndexes();
      console.debug(indexes);
      setFiles(indexes.map(index => ({ index })));
      // const files = await downloadAllFiles(indexes);
      // setFiles(files);
    })();
  }, []);

  // Uploads

  async function handleFileLoaded(file: File) {
    // NOTE(alec): Set to true for only text uploads
    let strict = false;
    if (strict && !file.type.match(/text.plain/)) {
      return;
    }
    setError("");
    setFile(file);

    const indexes = await API.files.getFileIndexes();
    const updatedFiles: FileIndexWithContents[] = [];
    for (let index of indexes) {
      if (files[index]?.contents) {
        updatedFiles[index] = files[index];
      } else {
        updatedFiles[index] = { index };
      }
    }
    setFiles(updatedFiles);
  }

  async function handleFileUpload() {
    if (file) {
      await FileClient.uploadFile(file);
      setFile(null);
    }

    // downloadAllFiles(fileIndexes);
  }

  async function handleDownloadFile(index: number) {
    if (files.find(file => file.index === index)?.contents) {
      // NOTE(alec): Don't redownload a file which has already been downloaded
      return;
    }
    const fileBlob = await FileClient.downloadFile(index);

    if (fileBlob.type === "application/json") {
      setError("File failed to download - likely no files.");
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const fileIndex = files.findIndex(
          existingFile => existingFile.index === index
        );
        files[fileIndex].contents =
          typeof reader.result === "string" ? reader.result : "";
        setFiles([
          ...files.slice(0, fileIndex),
          {
            index: fileIndex,
            contents: typeof reader.result === "string" ? reader.result : ""
          },
          ...files.slice(fileIndex + 1)
        ]);
      };
      reader.readAsText(fileBlob);
    }
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#282c34",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Input onFileLoaded={handleFileLoaded} />
      <button onClick={handleFileUpload}>Upload file {file?.name}</button>
      {/* <button onClick={() => downloadAllFiles()}>Download files</button> */}
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
      <p>Files:</p>
      <ul>
        {files.map((file, index) => (
          <FileRow key={index} onClick={() => handleDownloadFile(file.index)}>
            File ${file.index} - {file.contents || "Not loaded"}
          </FileRow>
        ))}
      </ul>
    </div>
  );
};

export default App;

// STYLES

const FileRow = styled.li`
  &:hover {
    background: lightblue;
  }
`;
