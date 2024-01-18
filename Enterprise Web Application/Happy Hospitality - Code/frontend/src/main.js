import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/main.css";
import "./assets/styles/normalize.css";
import router from "./router";

createApp(App).use(router).mount("#app");
