export const config = {
  SERVER_HOST: "localhost",
  SERVER_PORT: "3691",
  SERVER_PROTOCOL: "http",
  POST_CRON: "/cron",
  DELETE_CRON: "/cron",
  GET_CRONS: "/crons"
};

export const MODAL_TYPES = {
  CREATE_CRON: {
    id: 1,
    MODAL_TITLE: "Modal to create new folder",
    TRIGGER_BUTTON_TEXT: "Create Folder",
    SUBMIT_BUTTON_TEXT: "Create Folder"
  },
  DELETE_CRONS: {
    id: 2,
    MODAL_TITLE: "Modal to delete crons",
    TRIGGER_BUTTON_TEXT: "Delete Items",
    SUBMIT_BUTTON_TEXT: "Delete Items"
  }
};