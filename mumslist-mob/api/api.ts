const endpoint = "http://localhost:8000";

async function basicGet() {
  await request("/", "GET");
}

async function basicPost() {
  await request("/", "POST");
}

async function getFileCount() {
  const result = await request<number>("/file/count/", "GET");
  return result;
}
async function getFileIndexes() {
  const result = await request<number[]>("/file/", "GET");
  return result;
}

type Method = "GET" | "POST";
async function request<ResponseShape, RequestShape = {}>(
  url: string,
  method: Method,
  payload?: RequestShape
) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const response = await fetch(
    `${endpoint}${url.startsWith("/") ? url : "/" + url}`,
    {
      method,
      body: payload && JSON.stringify(payload),
      headers
      // credentials: "include",
      // redirect: "follow",
      // mode: "cors"
    }
  );

  let result = {
    status: response.status,
    response: {} as ResponseShape
  };

  if (response.status === 200) {
    result.response = await response.json();
    return result.response;
  }

  throw result;
}

export default {
  basicGet,
  basicPost,
  files: {
    getFileCount,
    getFileIndexes
  }
};
