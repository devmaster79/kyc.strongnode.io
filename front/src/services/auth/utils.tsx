import axios from "axios";

/** Get the response data even if the response status is not 2xx */
export async function getResponseData(
  route: string,
  data: any = {}
): Promise<any> {
  try {
    const response = await axios.post(route, data);
    return response.data;
  } catch (e: any) {
    return e.response.data;
  }
}

export function setToken(token: string | null) {
  if (token === null) {
    localStorage.removeItem("token");
  } else {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}
