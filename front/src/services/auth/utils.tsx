import axios from 'axios';

/** Get the response data even if the response status is not 2xx */
export async function getResponseData<RequestData, ResponseData>(
  route: string,
  data: RequestData | Record<never, never> = {}
): Promise<ResponseData> {
  try {
    const response = await axios.post(route, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      throw new Error('Something went wrong, there is no data: ' + error);
    }
  }
}

export function setToken(token: string | null) {
  if (token === null) {
    localStorage.removeItem('token');
  } else {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}
