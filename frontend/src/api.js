import axios from "axios";
import { config } from "./constants.js";

const SERVER_URL = `${config["SERVER_PROTOCOL"]}://${config["SERVER_HOST"]}:${config["SERVER_PORT"]}`;
// const SERVER_URL = `https://private-cloud-backend.in.ngrok.io`;

export const URLS = {
  POST_CRON: `${SERVER_URL}${config["POST_CRON"]}`,
  DELETE_CRON: `${SERVER_URL}${config["DELETE_CRON"]}`,
  GET_CRONS: `${SERVER_URL}${config["GET_CRONS"]}`,
};

export const getCrons = () => {
  return axios.get(URLS["GET_CRONS"]);
};

export const postCron = (data) => {
  return axios.post(URLS["POST_CRON"], data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCron = (crons) => {
  return axios.delete(URLS["DELETE_CRON"], { data: crons });
};
