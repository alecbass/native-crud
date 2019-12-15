import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button } from "react-native";
import { FileClient, API } from "../api";

interface FileIndexWithContents {
  index: number;
  contents?: string;
}

const ScreenFiles: React.FC = _ => {
  const [files, setFiles] = useState<FileIndexWithContents[]>([]);
  const [error, setError] = useState("");
  const hasDownloaded = useRef(false);

  useEffect(() => {
    (async () => {
      const fileIndexes = await API.files.getFileIndexes();
      setFiles(fileIndexes.map(fileIndex => ({ index: fileIndex })));
    })();
  }, []);

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
        hasDownloaded.current = true;
      };
      reader.readAsText(fileBlob);
    }
  }

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <Text>{error}</Text>
      <Text>
        Files - {files.length} {hasDownloaded.current}
      </Text>
      {files.map((file, index) => (
        <Text
          key={index}
          onPress={() => handleDownloadFile(file.index)}
          style={{ textAlign: "center", flex: 1 }}
        >
          {file.index} - {file.contents?.length}:{" "}
          {file.contents || "Not loaded yet"}
        </Text>
      ))}
    </View>
  );
};

export default ScreenFiles;
