<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="py-2">
      <label class="mr-2 font-semibold">Room name</label><br>
      <input
        v-model="roomname"
        class="border-2 border-black rounded-lg px-4 py-2"
        type="text"
        placeholder="Room name"
      >
    </div>
    <div class="py-2">
      <label class="mr-2 font-semibold">User name</label><br>
      <input
        v-model="username"
        class="border-2 border-black rounded-lg px-4 py-2"
        type="text"
        placeholder="User name"
      >
    </div>
    <button
      class="bg-blue-400 px-4 py-2 mt-2 rounded-lg border-black border-2 mx-2 font-medium"
      @click="createroom"
    >
      Create Room
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wspath:null,
      wsuri:null,
      ws_received_data:null,
      roomname:'',
      username:'',

      }
  },
  methods:{
    createroom(event){
      
      this.wspath="/ws/"+this.roomname+"/?username="+this.username+'&method=createroom'
      this.wsuri=this.$wsurl+this.wspath
      this.$store.dispatch('commitchanges',['createconnection',this.wsuri])
      this.$store.state.wsconnection.onmessage=(event)=>{
       this.ws_received_data=JSON.parse(event.data)
       this.validate_data()

      }
      
    
    },
    validate_data(event){
      if (this.ws_received_data.status=='failed'){
        alert(this.ws_received_data.status_code)
        this.$store.state.wsconnection.close()
        this.$store.state.wsconnection.onmessage=null

      }
      else{
        
        this.$store.state.wsconnection.onmessage=null
        this.$store.dispatch('commitchanges',['updateusername',this.username])
        this.$router.push({ path: '/lobbyowner' }); 

      }
    }
  },
    

  

}
</script>

<style scoped>

</style>