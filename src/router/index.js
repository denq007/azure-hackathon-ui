import { createWebHistory, createRouter } from "vue-router";
import Dialog from '../components/DialogComponent.vue'
import JiraComponent from '../components/JiraComponent.vue'


const routes = [
  {
    path: "/",
    name: "Home",
    component: JiraComponent,
  },
  {
    path: "/chatgpt",
    name: "ChatGpt",
    component: Dialog,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;