import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupStore } from "./stores";
import "./styles/index.scss";
const app = createApp(App);
setupRouter(app);
setupStore(app);
app.mount("#app");
