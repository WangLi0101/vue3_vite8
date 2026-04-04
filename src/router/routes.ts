export const staticRoutes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
  },
];
