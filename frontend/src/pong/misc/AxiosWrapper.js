import axios from "axios";

export default class AxiosWrapper {
    constructor(baseURL, headers) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    get = async (endpoint) => {
        let response = null;
        try {
            response = await axios.get(
                this.baseURL + endpoint,
                {
                    headers: this.headers,
                }
            )
        } catch (e) {
            throw e;
        }
        return response.data;
    }

    patch = async (endpoint, data) => {
        let response = null;
        try {
            response = await axios.patch(
                this.baseURL + endpoint,
                data,
                {
                    headers: this.headers,
                }
            )
        } catch (e) {
            throw e;
        }
        return response.data;
    }

}