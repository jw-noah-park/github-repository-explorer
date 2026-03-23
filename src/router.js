import { createRouter, createWebHistory } from "vue-router";
import SearchPage from "./pages/SearchPage.vue";
import FavoritesPage from "./pages/FavoritesPage.vue";
import RepoDetailsPage from "./pages/RepoDetailsPage.vue";

const routes = [
  {
    path: "/",
    component: SearchPage,
  },
  {
    path: "/repo/:owner/:name",
    component: RepoDetailsPage,
  },
  {
    path: "/favorites",
    component: FavoritesPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
