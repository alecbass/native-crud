import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
// https://www.npmjs.com/package/react-native-sound-player
import SoundPlayer from "react-native-sound-player";
import { fileExtension } from "./utils";
import fs from "react-native-fs";

interface Props {
  musicFile: string;
}

const MusicPlayer: React.FC<Props> = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const onFinishedLoadingSubscription = useRef(null);
  const onFinishedPlayingSubscription = useRef(null);

  useEffect(() => {
    onFinishedLoadingSubscription.current = SoundPlayer.addEventListener(
      "FinishedLoading",
      e => {
        console.debug("Finished loading file");
        setCanPlay(true);
      }
    );

    onFinishedPlayingSubscription.current = SoundPlayer.addEventListener(
      "FinishedPlaying",
      e => {
        console.debug("Finished playing file");
        setIsPlaying(false);
      }
    );

    return () => {
      onFinishedLoadingSubscription?.current.remove();
      onFinishedPlayingSubscription?.current.remove();
      onFinishedLoadingSubscription.current = null;
      onFinishedPlayingSubscription.current = null;
    };
  }, []);

  useEffect(() => {
    const { musicFile } = props;
    const extension = fileExtension(musicFile);
    (async () => {
      await fs.readFile(musicFile, "ascii");
      const r = await fs.stat(musicFile);
      console.debug(r);
    })();
    SoundPlayer.loadSoundFile(musicFile, extension);
  }, [props.musicFile]);

  function handlePlayPauseButtonPress() {
    const { musicFile } = props;
    if (!isPlaying) {
      const extension = fileExtension(props.musicFile);
      SoundPlayer.playSoundFile(musicFile, extension);
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <View style={styles.wrapper}>
      <Text>Music player for {props.musicFile}</Text>
      <View style={styles.player}>
        <Text>Playing: {isPlaying}</Text>
      </View>
      <Button
        title={isPlaying ? "Stop" : "Play"}
        onPress={handlePlayPauseButtonPress}
        color={canPlay ? "#89a8d6" : "#c9c5c3"}
      />
    </View>
  );
};

export default MusicPlayer;

// STYLES

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
    paddingHorizontal: 8
  },
  player: {
    display: "flex",
    flex: 1,
    backgroundColor: "white"
  },
  playButton: {
    flex: 0
  }
});
