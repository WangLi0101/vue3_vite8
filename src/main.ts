import "./styles/index.scss";

import { createApp } from "vue";

import { setupRouter } from "./router";
import { setupStore } from "./stores";

import App from "./App.vue";
const app = createApp(App);
setupRouter(app);
setupStore(app);
app.mount("#app");
