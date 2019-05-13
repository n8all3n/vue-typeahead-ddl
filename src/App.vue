<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top" id="mainNav">
        <a class="navbar-brand" href="#">vue-typeahead-ddl</a>
    </nav>
    <main role="main" class="container">
      <div class="starter-template">
        <h1 id="home">vue-typeahead-ddl</h1>
        <p class="lead">
          A simple to use typeahead dropdown created in Vue with no dependencies
        </p>
        <div class="card example-card">
            <div class="card-body">
                <h2>Simple example with static list</h2>
                <div class="row">
                  <autocomplete class="col-4" :placeholder="'Type a fruit'" :items="[ 'Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" v-model="fruitVal"  />
                </div>
                <div class="row">
                  <div class="col-12">
                    <strong>Configuration:</strong>
                    <br>
                    <code>
                      &lt;autocomplete class="col-4" :placeholder="'Type a fruit'" :items="[ 'Apple', 'Banana', 'Orange', 'Mango', 'Pear', 'Peach', 'Grape', 'Tangerine', 'Pineapple']" v-model="fruitVal"  /&gt;
                    </code>
                  </div>
                </div>         
            </div>
        </div>
        <div class="card example-card">
            <div class="card-body">
                <h2>Typeahead with API to Github users</h2>
                <div class="row">
                  <autocomplete class="col-4" :placeholder="'Type a github user name'" @loadResults="loadResults" :isAsync="true" :items="ddlItems" :textField="'login'"  v-model="searchVal" @itemSelected="ddlItemSelected" :debounceDelay="200" />
                </div>
                <div class="row">
                  <div class="col-12">
                    <strong>You Selected:</strong>
                    <pre>{{userSelected}}</pre>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <strong>Configuration:</strong>
                    <br>
                    <code>
                       &lt;autocomplete class="col-4" :placeholder="'Type a github user name'" @loadResults="loadResults" :isAsync="true" :items="ddlItems" :textField="'login'"  v-model="searchVal" @itemSelected="ddlItemSelected" :debounceDelay="200" /&gt;
                    </code>
                  </div>
                </div>         
            </div>
        </div>
        <hr />
        <h2>Props</h2>
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col" class="type-col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>items</td>
              <td><code>Array</code></td>
              <td></td>
              <td>Array of items to be available in the drop down list <i>**Required</i></td>
            </tr>
             <tr>
              <td>isAsync</td>
              <td><code>Boolean</code></td>
              <td><code>false</code></td>
              <td><code>false</code> if doing a simple dropdown list with static items - <code>true</code> if a dropdown list with api items</td>
            </tr>
            <tr>
              <td>textField</td>
              <td><code>String</code></td>
              <td><code>''</code></td>
              <td>
                Name of the field in JSON that will be diplayed in the dropdown list
              </td>
            </tr>
            <tr>
              <td>minChars</td>
              <td><code>Number</code></td>
              <td><code>2</code></td>
              <td>
                If <code>isAsync === true</code> then the number of characters that must be entered before the event <code>loadResults</code> is fired to load results from an API.
              </td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td><code>String</code></td>
              <td><code>''</code></td>
              <td>
                <code>placeholder</code> value for the input
              </td>
            </tr>
            <tr>
              <td>debounceDelay</td>
              <td><code>Number</code></td>
              <td><code>500</code></td>
              <td>
                A custom debounce delay if using with <code>isAsync</code>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h2>Events</h2>
         <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>loadResults</td>
              <td>Triggered when enough characters are entered to need to load results. Only fired when <code>isAsync</code> is true. The search string is passed in as a parameter.</td>
            </tr>
            <tr>
              <td>itemSelected</td>
              <td>Triggered when an item is selected. The item that was selected is returned.</td>
            </tr>
          </tbody>
         </table>
      </div>
    </main>
  </div>
</template>

<script>
/* eslint-disable */
import autocomplete from './components/vue-typeahead-ddl.vue'
import axios  from 'axios'
export default {
  /* eslint-disable */
  name: 'app',
  components: {
    autocomplete
  },
  data() {
    return{
      ddlLoaded: false,
      ddlItems: [],
      searchVal: '',
      fruitVal: '',
      userSelected: {}
    }
  },
  methods: {
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
      this.userSelected = selectedItem;
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
    position: relative;
  }

  .example-card {
    margin-bottom: 2rem;
  }

  .type-col {
    width: 10%;
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
