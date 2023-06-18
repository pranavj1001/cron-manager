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
    MODAL_TITLE: "Modal to create new Cron",
    TRIGGER_BUTTON_TEXT: "Create Cron",
    SUBMIT_BUTTON_TEXT: "Create Cron"
  },
  DELETE_CRONS: {
    id: 2,
    MODAL_TITLE: "Modal to delete Cron(s)",
    TRIGGER_BUTTON_TEXT: "Delete Cron(s)",
    SUBMIT_BUTTON_TEXT: "Delete Cron(s)"
  }
};