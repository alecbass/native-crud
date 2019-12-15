class FileClient {
  private endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  uploadFile(file: File, url: string = "/file/") {
    console.debug(`Uploading ${file.name}`);
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.upload.addEventListener("error", event => {
        reject("File did not upload");
      });

      request.upload.addEventListener("progress", event => {});

      request.addEventListener("load", event => {
        resolve({
          status: request.status,
          headers: new Headers(),
          response:
            request.status !== 204
              ? JSON.parse(request.responseText)
              : undefined
        });
      });

      request.open("post", `${this.endpoint}/file/`, true);
      request.setRequestHeader("Content-Type", "application/octet-stream");
      request.setRequestHeader(
        "Content-Disposition",
        `attachment: filename=${file.name}`
      );
      request.send(file);
    });
  }

  downloadFile(index: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.responseType = "blob";
      request.upload.addEventListener("error", event => {
        console.error(event);
        console.error(request);
        reject("File did not upload");
      });

      request.upload.addEventListener("progress", event => {
        console.debug(request);
      });

      request.addEventListener("load", event => {
        console.debug(event);
        resolve(request.response as Blob);
      });

      request.open("get", `${this.endpoint}/file/${index}`, true);
      request.send();
    });
  }
}

export default new FileClient("http://localhost:8000");
