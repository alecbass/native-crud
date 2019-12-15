import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Image,
  ScrollView
} from "react-native";
import CameraRoll, {
  PhotoIdentifier
} from "@react-native-community/cameraroll";
import { ImagePicker } from "../components";
import { PermissionsContext } from "../context/PermissionsContext";

const ScreenUpload: React.FC = _ => {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const permissions = useContext(PermissionsContext);

  async function loadPhotos() {
    const photos = await CameraRoll.getPhotos({
      first: 100,
      assetType: "All"
    });
    setPhotos(photos.edges);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  const { canReadFiles } = permissions.state;

  if (!canReadFiles) {
    return <View><Text>Can't read files</Text></View>
  }
  return (
    <View style={styles.wrapper}>
      <ImagePicker canRead={canReadFiles} images={photos} />
      {/* <View style={styles.title}>
         <Text onPress={() => setShowIP(!showIP)}>Toggle Image Picker</Text>
       </View>
       <View style={styles.upload}>
         {showIP && <ImagePicker canRead={canRead} images={photos} />}
       </View> */}
    </View>
  );
};

// STYLES

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    // height: "100%",
    // width: "100%",
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 16,
    backgroundColor: "#5dc8e3"
  },
  title: {},
  upload: {
    flex: 1
  }
});

export default ScreenUpload;
