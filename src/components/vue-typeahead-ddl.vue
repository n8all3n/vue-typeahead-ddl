<template>
  <div class="autocomplete">
    <input class="autocomplete-input"
      type="text"
      @input="onChange($event.target.value)"
      :value="value"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @click="onInputClick();"
    />
    <div id="autocomplete-results"  v-show="isOpen" class="autocomplete-results">
     <span class="loading" v-if="isLoading">Loading...</span>
      <span v-else-if="!isLoading && results.length == 0">
        No Results Found...
      </span>
      <span
      v-else-if="!isLoading && results.length > 0"
      v-for="(result, i) in results" :key="i" @click="setResult(result)" class="autocomplete-result" 
      :class="{ 'is-active': i === arrowCounter }">
        {{isAsync ? result[textField] : result}}
      </span>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  import { clearTimeout, setTimeout } from 'timers';
  export default {
    name: 'autocomplete',

    props: {
      ['value']:{},
      items: {
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
      valueField: {
        type: String,
        required: false,
        default:  ''
      },
      textField: {
        type: String,
        required: false,
        default: ''
      }
    },

    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        isLoading: false,
        arrowCounter: 0,
        activeKey: -1,
        selectedValue: {},
        dataInitLoaded: false,

        debounceFunc: null
      };
    },
    methods: {
      onInputClick() {
        if (this.value && this.value.length>= 2) {
          if (this.isAsync) {
              if(!this.dataInitLoaded) {
              this.dataInitLoaded = true;
              this.isLoading = true;
              this.$emit('loadResults', this.value);
            }
            this.isOpen = true;
          } else {
            this.isOpen = true;
          }
        } else {
          this.results = [];
        }
      },
      onChange(val) {
        // Let's warn the parent that a change was made
        this.$emit('input', val);

        if (val && val.length >=2) {
          // Is the data given by an outside ajax request?
          if (this.isAsync) {
              clearTimeout(this.debounceFunc);
              this.debounceFunc = setTimeout(() => {
              this.isLoading = true;
              this.isOpen = true;
              this.$emit('loadResults', val)
             }, 500);
          } else {
            this.isOpen= true
            this.results = this.items.filter((item) => {
              return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
          }
        } else {
          this.results = [];
          this.isOpen = false;
        }

      },
      filterResults(val) {
        // first uncapitalize all the things
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      },
      setResult(result, key) {
        this.$emit('input', result[this.textField]);
        this.$emit('itemSelected', result);

        // this.value = result;
        // this.activeKey = key;
        this.isOpen = false;
      },
      onArrowDown(evt) {
        if (this.arrowCounter < this.results.length) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter -1;
        }
      },
      onEnter() {
        if (this.arrowCounter >= 0 && this.results.length > 0) {
          var selectedResult = this.results[this.arrowCounter];
          if(selectedResult) {
            this.$emit('input', selectedResult[this.textField])
            this.$emit('itemSelected', selectedResult);
            this.isOpen = false;
            this.arrowCounter = -1;
          }
        } else {
          this.isOpen = true;
          this.arrowCounter = 0;
        }
      
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      }
    },
    watch: {
      items: function (val, oldValue) {
        this.results = val;
        this.isLoading = false;
      },
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    }
  };
</script>
<style>
  .autocomplete-input {
    width:100%;
  }
  .autocomplete {
    position: relative;
    width: 100%;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    overflow: auto;
    width: 100%;
    max-height: 350px;
  }

  .autocomplete-result {
    position: relative;
    display: block;
    background-color: #fff;
    text-align: left;
    margin: 0;
    font: inherit;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }

</style>