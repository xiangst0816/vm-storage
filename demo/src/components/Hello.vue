<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <strong>This is build for Vue!</strong>
    <section>
      <h2>localStorage</h2>
      <div class="state">
        <div class="state__name">State</div>
        <div class="state__params">
          <div class="state__params--name">prefix:</div>
          <div class="state__params--value">123123</div>
        </div>
      </div>

    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Vue!'
      }
    },
    mounted () {
      this.$localStorage.setItem('a', 123)
      console.debug(this.$localStorage)
      console.debug(this.$localStorage.getItem('a'))
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}




</style>
