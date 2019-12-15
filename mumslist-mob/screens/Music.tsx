import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Picker } from "react-native";
import Permissions from "react-native-permissions";
import { PermissionsContext } from "../context/PermissionsContext";
import fs from "react-native-fs";
import Sound from "react-native-sound";
import { MusicPlayer } from "../components";

const ScreenMusic: React.FC = _ => {
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  async function getFilePaths(files: fs.ReadDirItem[]) {
    const paths: string[] = [];
    for (let file of files) {
      if (file.isFile()) {
        paths.push(file.path);
      } else if (file.isDirectory()) {
        const statResult = await fs.readDir(file.path);
        paths.push(...statResult.map(file => file.path));
      }
    }

    return paths.filter(p => p.endsWith(".mp3"));
  }

  async function readFilePaths() {
    const files = await getFilePaths(
      await fs.readDir(fs.ExternalStorageDirectoryPath)
    );
    setFilePaths(files);
  }

  useEffect(() => {
    readFilePaths();
  }, []);

  return (
    <ScrollView style={styles.wrapper}>
      <Text>Screen Music</Text>
      <Text>Loaded {filePaths.length} files</Text>
      <Picker onValueChange={audio => setCurrentAudio(audio)}>
        {filePaths.reverse().map((path, index) => (
          <Picker.Item label={path} value={path} key={index} />
        ))}
      </Picker>
      {currentAudio && <MusicPlayer musicFile={currentAudio} />}
    </ScrollView>
  );
};

// STYLES

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1
  }
});

export default ScreenMusic;
