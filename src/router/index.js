import { createRouter, createWebHistory } from 'vue-router'
import Index from '../components/Index.vue'
import joinroom from '../components/joinroom.vue'
import createroom from '../components/createroom.vue'
import lobbyowner from '../components/lobbyowner.vue'
import lobbyparticipant from '../components/lobbyparticipant.vue'
import gameground from '../components/gameground.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/joinroom',
    name: 'JoinRoom',
    component: joinroom
  },
  {
    path: '/createroom',
    name: 'CreateRoom',
    component: createroom
  },
  {
    path: '/lobbyowner',
    name: 'LobbyOwner',
    component: lobbyowner
  },
  {
    path: '/lobbyparticipant',
    name: 'LobbyParticipant',
    component: lobbyparticipant
  },
  {
    path: '/gameground',
    name: 'GameGround',
    component: gameground
  },
  
]
const router = createRouter({history: createWebHistory(),routes})
export default router