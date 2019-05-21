<template>
  <div class="app">
    <div class="app__img" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
    import HelloWorld from '../particles/HelloWorld';

    export default {
      name: "Home",
      components: {
        HelloWorld
      }
    }
</script>
