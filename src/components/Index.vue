<template>
  <div class="flex flex-col justify-center h-screen">
    <div class="flex-row self-center">
      <button
        class="bg-blue-400 px-4 py-2 rounded-lg border-black border-2 mx-2 font-medium "
        @click="navigate('/createroom')"
      >
        Create Room
      </button>
      <button
        class="bg-red-400 px-4 py-2 rounded-lg border-black border-2 mx-2 font-medium"
        @click="navigate('/joinroom')"
      >
        Join Room
      </button>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
            navigate(event) {
                this.$router.push({ path: event });
            }
        }

}
</script>

<style scoped>

</style>