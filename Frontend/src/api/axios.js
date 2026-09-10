import axios from "axios";

export default axios.create({
  baseURL: "https://reposense.onrender.com",
  withCredentials: true,
});