import axios from "axios";

const api_url = axios.create({
  baseURL: "https://api.mataprabulinggih.net/api/v1/public/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api_url;
