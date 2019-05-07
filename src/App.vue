<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <!-- <vue-typeahead-ddl></vue-typeahead-ddl> -->
    <input type="button" @click="buttonClick();" value="Click it"/>
    <div class="row">
      <div class="col-lg-4">
          <autocomplete @loadResults="loadResults" :isAsync="true" :items="ddlItems" :valueField="'Id'" :textField="'Address'"  v-model="searchVal" @itemSelected="ddlItemSelected" />
      </div>
    </div>
  
  </div>
</template>

<script>
/* eslint-disable */
import autocomplete from './components/vue-typeahead-ddl.vue'
import HelloWorld from './components/HelloWorld.vue'
import axios  from 'axios'
export default {
  /* eslint-disable */
  name: 'app',
  components: {
    HelloWorld,
    autocomplete
  },
  data() {
    return{
      ddlItems: [],
      searchVal: '1234'
    }
  },
  methods: {
    buttonClick() {
      console.log(this.searchVal);
    },
    loadResults(search) {
      var vm = this;
      axios.get('/api/parcel/query?search=' + search).then(response => {
          if (response.data.status_code === 200) {
            vm.ddlItems = response.data.results;
          }
      });
    },
    ddlItemSelected(selectedItem) {
      console.log(selectedItem);
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
