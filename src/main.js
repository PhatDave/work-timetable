import {createApp} from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import App from "./App.vue";
import './style.css';

const routes = [
	{
		path: '/:any*',
		component: App,
	}
]

const router = createRouter({
	                            history: createWebHistory(),
	                            routes,
                            });

const app = createApp({});
app.use(router);

app.mount('#app');
