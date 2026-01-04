import { createRouter, createWebHistory } from 'vue-router';
import HeroesComponent from '../components/heroes/HeroesComponent.vue';
import HeroeComponent from '../components/heroe/HeroeComponent.vue';
import ErrorComponent from '../components/error/ErrorComponent.vue';

const routes = [
    {path: '/', component: HeroesComponent},
    {path: '/heroes', component: HeroesComponent},
    {path: '/heroe/:id', component: HeroeComponent},
    {path: '/:catchAll(.*)', component: ErrorComponent}
];

const router = createRouter({
    history : createWebHistory(import.meta.env.BASE_URL),
    routes
  });

export default router;