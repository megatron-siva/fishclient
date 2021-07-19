import { createStore } from "vuex";
export default createStore({
    state: {
        username:null,
        wsconnection:null,
        team_name:null,
        team_leader_name:null,
        team_members_name:null
    },
    mutations:{
        createconnection(state,wsuri){
            console.log(wsuri)
            state.wsconnection = new WebSocket(wsuri)
        },
        updateusername(state,name){
            state.username=name
        },
        update_team_name(state,name){
            state.team_name=name
        },
        update_team_leader_name(state,name){
            state.team_leader_name=name
        },
        update_team_members_name(state,name){
            state.team_members_name=name
        }
    },
    actions:{
        commitchanges(state,list){
            console.log(list[0],list[1])
            state.commit(list[0],list[1])
        }
    }

})