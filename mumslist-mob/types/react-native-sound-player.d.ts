declare module "react-native-sound-player" {
  import React from "react";

  export function playSoundFile(fileName: string, fileType: string);

  export function loadSoundFile(fileName: string, fileType: string);

  export function playUrl(url: string);

  export function loadUrl(url: string);

  type EventType =
    | "FinishedLoading"
    | "FinishedPlaying"
    | "FinishedLoadingURL"
    | "FinishedLoadingFile";
  export function addEventListener(
    event: EventType,
    callBack: (object: object) => any
  );

  export function onFinishedPlaying(callback: (success: boolean) => any);

  export function onFinishedLoading(callback: (success: boolean) => any);

  export function play();

  export function pause();

  export function resume();

  export function stop();

  export function seek(seconds: number);

  export function setSpeaker(on: boolean);

  // getInfo(): Promise<{ currentTime: number; duration: number }> {
  //   return new Promise();
  // };
}
