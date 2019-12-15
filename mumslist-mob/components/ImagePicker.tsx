import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  PermissionsAndroid,
  TouchableHighlight,
  GestureResponderEvent,
  FlatList,
  ScrollView
} from "react-native";
import { PhotoIdentifier } from "@react-native-community/cameraroll";
// import ImagePicker from "react-native-image-picker";

interface Source {
  uri: string;
}

interface Props {
  canRead: boolean;
  images: PhotoIdentifier[];
  onImagePicked?: () => void;
}

const ImagePickerComponent: React.FC<Props> = props => {
  const [pickedImageSrc, setPickedImageSrc] = useState("");

  // function handleImageTouchMove(event: GestureResponderEvent) {
  //   setX(event.nativeEvent.locationX);
  //   setY(event.nativeEvent.locationY);
  // }

  // async function getCameraPermissions() {
  //   const canAccessImages = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //     {
  //       title: "Access Storage",
  //       message: "Access storage for the photos",
  //       buttonPositive: "Yes",
  //       buttonNegative: "No"
  //     }
  //   );
  //   if (canAccessImages === PermissionsAndroid.RESULTS.GRANTED) {
  //     setCanRead(true);
  //   }
  // }
  // useEffect(() => {
  //   getCameraPermissions();
  // }, []);

  if (!props.canRead) {
    return (
      <View>
        <Text>You are not allowed to access images</Text>
      </View>
    );
  }

  if (!props.images.length) {
    return (
      <View>
        <Text>Loading images...</Text>
      </View>
    );
  }

  const uris: string[] = [];
  for (let image of props.images) {
    uris.push(image.node.image.uri);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.display}>
        <View style={styles.displayTextWrapper}>
          <Text style={styles.text}>
            Image picker/viewer - Loaded {props.images.length} images
          </Text>
        </View>
        <View
          style={{
            ...styles.pickedImageWrapper,
            backgroundColor: pickedImageSrc || "grey"
          }}
        >
          <Image source={{ uri: pickedImageSrc }} style={styles.pickedImage} />
        </View>
      </View>
      <ScrollView style={styles.galleryContainer}>
        <View style={styles.gallery}>
          {uris.map((uri, index) => (
            <TouchableHighlight
              key={index}
              onPress={() => setPickedImageSrc(uri)}
              style={styles.galleryImage}
            >
              <Image source={{ uri }} style={{ flex: 1 }} />
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// STYLES

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
    backgroundColor: "#dadce0"
  },
  display: {
    display: "flex",
    flex: 1,
    backgroundColor: "#b9e35d"
  },
  displayTextWrapper: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    flex: 1,
    height: 20,
    fontWeight: "bold"
  },
  pickedImageWrapper: {
    display: "flex",
    flex: 3,
    minHeight: 32,
    minWidth: 32,
    borderRadius: 64,
    marginBottom: 16
  },
  pickedImage: {
    flex: 1,
    borderRadius: 64
  },
  galleryContainer: {
    display: "flex",
    flex: 2,
    backgroundColor: "#678f71"
  },
  gallery: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  galleryImage: {
    display: "flex",
    height: 48,
    width: 48
  }
});

export default ImagePickerComponent;
