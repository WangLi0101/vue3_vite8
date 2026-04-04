import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { staticRoutes } from "./routes";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
});
export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
