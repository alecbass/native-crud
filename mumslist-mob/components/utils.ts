export function fileExtension(uri: string) {
  const splitByDots = uri.split(".");

  return splitByDots[splitByDots.length - 1];
}
