import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import RaceView from './views/RaceView.vue'
import ResultsView from './views/ResultsView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/loeb', name: 'race', component: RaceView },
    { path: '/resultat', name: 'results', component: ResultsView },
  ],
})