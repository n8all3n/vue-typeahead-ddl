<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a class="navbar-brand" href="#">vue-typeahead-ddl</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>
    </nav>
    <main role="main" class="container">
      <div class="starter-template">
        <h1>vue-typeahead-ddl</h1>
        <p class="lead">
          A simple to use typeahead dropdown created in Vue with no dependencies
        </p>
        <div class="card example-card">
            <div class="card-body">
                <h2>Simple example with static list</h2>
                <div class="row">
                  <autocomplete class="col-4" :items="[ 'Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" v-model="fruitVal"  />
                </div>
                <div class="row">
                  <div class="col-12">
                  
                    <code>
                      &lt;autocomplete class="col-4" :items="[ 'Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" v-model="fruitVal"  /&gt;
                    </code>
                  </div>
                </div>         
            </div>
        </div>
        <div class="card example-card">
            <div class="card-body">
                <h2>Typeahead with API to Github users</h2>
                <div class="row">
                  <autocomplete class="col-4" @loadResults="loadResults" :isAsync="true" :items="ddlItems" :valueField="'id'" :textField="'login'"  v-model="searchVal" @itemSelected="ddlItemSelected" />
                </div>
                <div class="row">
                  <div class="col-12">
                  
                  </div>
                </div>         
            </div>
        </div>
      </div>
    </main>
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

<style>
  body {
    padding-top: 5rem;
  }
  .starter-template {
    padding: 3rem 1.5rem;
  }

  .example-card {
    margin-bottom: 2rem;
  }
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

/* .autocomplete-result:hover {
  background-color: red;
} */
</style>
