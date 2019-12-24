import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet
} from "react-native";

import ScreenUpload from "./Upload";
import ScreenMusic from "./Music";
import ScreenFiles from "./Files";
import oscar from "../images/oscar.jpg";
import dad from "../images/dad.jpg";

const ScreenRoot: React.FC = _ => {
  const [name, setName] = useState("");
  const [screen, setScreen] = useState<"base" | "upload" | "music" | "files">(
    "upload"
  );

  function handleNameChange(e: string) {
    setName(e);
  }

  if (screen === "upload") {
    return (
      <View style={styles.scrollView}>
        <ScreenUpload />
      </View>
    );
  }

  if (screen === "music") {
    return (
      <View style={styles.scrollView}>
        <ScreenMusic />
      </View>
    );
  }

  if (screen === "files") {
    return (
      <View style={styles.scrollView}>
        <ScreenFiles />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.body}>
        <View style={styles.title}>
          <Text onPress={() => setScreen("upload")}>Crab eater!!!</Text>
          <Image source={dad} />
        </View>
        <View>
          <Text>Your name is: {name}</Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            editable={true}
            maxLength={20}
            onChangeText={handleNameChange}
            value={name}
            placeholder="Enter your name"
          />
        </View>
      </View>
    </ScrollView>
  );
};

// STYLES

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    alignContent: "stretch",
    height: "100%",
    width: "100%",
    backgroundColor: "#d0d0d0"
  },
  body: {
    flex: 1,
    paddingTop: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingRight: 12
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    paddingLeft: 8,
    paddingRight: 8
  }
});

export default ScreenRoot;
