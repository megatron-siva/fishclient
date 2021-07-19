<template>
  <div class="grid grid-cols-3 h-screen">
    <div class="flex flex-col px-2 py-2  h-screen">
      <div
        id="scrolltobottom"
        class="fex-1 h-full bg-gray-100 rounded-md p-2  overflow-y-scroll"
      >
        <div
          v-for="msg in all_messages"
          :key="msg"
          class="flex flex-col "
        >
          <p
            v-if="msg[0]!=$store.state.username"
            class="text-xs font-medium"
            :class="msg[3]+' '"
          >
            {{ msg[0] }}
          </p>
          <div
            class="inline-flex px-2 py-1 rounded-lg m-1 text-left  max-w-full  whitespace-pre-wrap break-word"
            :class="msg[3]+' '+msg[4]"
          >
            {{ msg[2] }}
          </div>
        </div>
      </div>
      <div class="flex mt-2">
        <input
          v-model="my_message"
          class="border-2 border-black rounded-lg px-4 py-2 w-full"
          type="text"
          placeholder="message"
        >
        <button
          class="bg-green-400 px-4 py-2 rounded-lg border-black border-2 mx-2 font-medium"
          @click="sendmessage(my_message)"
        >
          Send
        </button>
      </div>
    </div>
    <div class="w-full">
      <div class="flex justify-around bg-green-400 rounded-md border-2 border-gray-600 py-1">
        <span class="">USERNAME : {{ $store.state.username }} </span>
        <span class="">TEAMNAME : {{ $store.state.team_name }} </span>
      </div>
      <div class="h-1/3 flex flex-row pt-2">
        <button
          class="bg-red-300 w-full mx-1 rounded-3xl border-2 border-gray-600 "
          :class="visibility"
          @click="pickoption(1)"
        >
          1
        </button>
        <button
          class="bg-blue-500 w-full mx-1 rounded-3xl border-2 border-gray-600"
          :class="visibility"
          @click="pickoption(2)"
        >
          2
        </button>
      </div>
      <div class="font-semibold text-lg text-center mt-3">
        Timer:{{ timer }}
      </div>
      <div class="font-semibold text-lg text-center mt-3">
        Current Choice:{{ currentchoice }}
      </div>
    </div>
    <div class="w-full pt-1 px-3">
      <table class="w-full flex flex-col">
        <tr class="flex flex-row justify-around bg-gray-400 ">
          <th>team0</th>
          <th>team1</th>
          <th>team2</th>
          <th>team3</th>
        </tr>
        <tr
          v-for="i in count_score"
          :key="i"
          class="flex flex-row justify-around"
        >
          <td
            v-for="j in i"
            :key="j"
            class="flex flex-row justify-around"
          >
            {{ j[0]+' ('+j[1]+')' }}
          </td>
        </tr>
        <tr class="flex flex-row justify-around bg-red-400">
          <td
            v-for="profit in total_profit"
            :key="profit"
            class="flex flex-row justify-around "
          >
            {{ profit }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      username:this.$store.state.username,
      team_name:this.$store.state.team_name,
      team_leader_name:this.$store.state.team_leader_name,
      team_members_name:this.$store.state.team_members_name,
       my_message:null,
       all_messages:[],
       scrollupdated:true,
       count_score:[],
       total_profit:[0,0,0,0],
       current_day:null,
       timer:null,
       currentchoice:1,
       visibility:'invisible'
    }
  },
  mounted() {
    if(this.$store.state.username==this.$store.state.team_leader_name){
      this.visibility='visible'
    }
    
    this.$store.state.wsconnection.onmessage = (event)=> {
        this.ws_received_data=JSON.parse(event.data)
        console.log(this.ws_received_data)
        this.validate_data()
        
      }

  },
  updated(){
    this.$nextTick(() =>{
      if(!this.scrollupdated){    
       var container = this.$el.querySelector("#scrolltobottom");
          container.scrollTop = container.scrollHeight;
          this.scrollupdated=true
      }
  })
  },
  methods: {
    pickoption(option){
      this.$store.state.wsconnection.send(JSON.stringify(
      {
        mtype:"option_picking",
        username:this.username,
        choice:option,
        day:this.current_day,
        teamname:this.team_name
      }))
    }
    ,
    sendmessage(msg){
      if(msg==null || msg==''){
        this.my_message=null
        return
      }
      this.$store.state.wsconnection.send(JSON.stringify(
      {
        mtype:"message",
        username:this.username,
        data:msg,
        to:"all_members"
      }))
      this.my_message=null
    },
     validate_data(event){
      if (this.ws_received_data.mtype=='message'){
        if (this.ws_received_data.status=='succeed'){
          let a=[]
          a.push(this.ws_received_data.username)
          if(this.ws_received_data.username==this.username){
            a.push('mymessage')
            a.push(this.ws_received_data.data)
            a.push('self-end')
            a.push('bg-blue-300')
          }
          else{
            a.push('othermessage')
            a.push(this.ws_received_data.data)
            a.push('self-start')
            a.push('bg-gray-300')
          }
          this.all_messages.push(a)
          this.scrollupdated=false
          //var container = this.$el.querySelector("#scrolltobottom");
          //container.scrollTop = container.scrollHeight;

        }
      }
      else if (this.ws_received_data.mtype=='score'){
        let count=this.ws_received_data.count
        let profit=this.ws_received_data.profit
        let a=[]
        for (let i=0;i<count.length;i++){
          let arr=[]
          arr.push(count[i])
          arr.push(profit[i])
          a.push(arr)
          this.total_profit[i]+=profit[i]
        }
        this.count_score.push(a)

      }
      else if (this.ws_received_data.mtype=='command'){
        if (this.ws_received_data.commandname=='day_started'){
          this.current_day=this.ws_received_data.day
          this.timer=this.ws_received_data.timer
          this.runtimer()
        }
      }
      else if (this.ws_received_data.mtype=='option_picking'){
        if (this.ws_received_data.status=='succeed'){
          this.currentchoice=this.ws_received_data.choice

        }

      }
     
    },
    runtimer(){
      if(this.timer>0){
      setTimeout(()=>{
        this.timer-=1
        this.runtimer()},
        1000)
      }
    }
      }
  

}
</script>

<style>

</style>