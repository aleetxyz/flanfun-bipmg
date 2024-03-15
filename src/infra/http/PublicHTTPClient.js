import axios from "axios";

const publicHttpClient = axios.create({
  headers: null,
});

export default publicHttpClient;
