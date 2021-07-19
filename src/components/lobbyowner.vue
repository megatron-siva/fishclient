<template>
  <div class="h-screen flex flex-col pt-1">
    <div class="text-center bg-green-400 py-1 mx-10 rounded-md font-semibold">
      LOBBY
    </div>
    <div class="flex-1 flex flex-col items-center justify-between">
      <div>
        <p
          v-for="name in usernames"
          :key="name"
          class="bg-yellow-300 px-5 py-2 mx-1 my-2 rounded-lg inline-block"
        >
          {{ name }}
        </p>
      </div>
      <div class="mb-5">
        <button
          class="bg-blue-400 px-4 py-2 rounded-lg border-black border-2 mx-2 font-medium"
          @click="startgame"
        >
          Start
        </button>
        <button
          class="bg-red-400 px-4 py-2 rounded-lg border-black border-2 mx-2 font-medium"
          @click="cancelroom"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      usernames:null,
      ws_received_data:null,
    }
  },
  mounted() {
    
    this.$store.state.wsconnection.onmessage = (event)=> {
        this.ws_received_data=JSON.parse(event.data)
        this.validate_data()
      }

  },
  methods:{
    startgame(){
      this.$store.state.wsconnection.send(JSON.stringify({
      mtype:"command",
      commandname:"startgame",
      username:this.$store.state.username
      }))
  },
   validate_data(event){
      if (this.ws_received_data.mtype=='usernames_updated'){
      const array=[]
       this.usernames=this.ws_received_data.usernames

      }
      else if(this.ws_received_data.mtype=='room_cancelled'){
        alert(this.ws_received_data.mtype)
        this.$router.go(-1)
      }
      else if(this.ws_received_data.mtype=='command'){
        if(this.ws_received_data.commandname=='startgame'){
          //this.$router.push({ path: '/gameground' });
          console.log(this.ws_received_data.teamname)
          this.$store.dispatch('commitchanges',['update_team_name',this.ws_received_data.teamname])
          this.$store.dispatch('commitchanges',['update_team_leader_name',this.ws_received_data.leadername])
          this.$store.dispatch('commitchanges',['update_team_members_name',this.ws_received_data.membersname])
          this.$router.push({ path: '/gameground' }); 
        }
       
      }
     
    },
    cancelroom(){
      this.$store.state.wsconnection.close()
      this.$router.go(-1)
    }

    }
    
    

}
</script>

<style scoped>

</style>