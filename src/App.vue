<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <!-- <vue-typeahead-ddl></vue-typeahead-ddl> -->
    <input type="button" @click="buttonClick();" value="Click it"/>
    <div class="row">
      <div class="col-lg-2">
          <autocomplete @loadResults="loadResults" :isAsync="true" :items="ddlItems" :valueField="'id'" :textField="'login'"  v-model="searchVal" @itemSelected="ddlItemSelected" />
      </div>
    </div>
     <div class="row">
      <div class="col-lg-2">
          <autocomplete :isAsync="false" :items="[ 'Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" v-model="fruitVal"  />
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
      ddlLoaded: false,
      ddlItems: [],
      searchVal: 'n8',
      fruitVal: ''
    }
  },
  methods: {
    buttonClick() {
      console.log(this.searchVal);
    },
    loadResults(search) {
      var vm = this;
      axios.get('https://api.github.com/search/users?q=' + search).then(response => {
          if (response.status === 200) {
            vm.ddlItems = response.data.items;
          }
      }).catch(function(err){
        console.log(err);
      });
    },
    ddlItemSelected(selectedItem) {
      console.log(selectedItem);
    }

  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.autocomplete-result:hover {
  background-color: red;
}
</style>
