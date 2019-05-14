<template>
  <div class="autocomplete">
    <div v-if="tagMode" class="tag-container">
      <span v-for="(result, x) in tags" :key="x" class="badge">{{result}}
        <i href="#" class="badge-remove" @click="tagRemoveClick(x);"></i>
      </span>
    </div>
    <input class="autocomplete-input" v-if="tagMode"
      type="text"
      :placeholder="placeholder"
      @input="onChange($event.target.value)"
      v-model="tagInputValue"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @click="onInputClick();"
    />
    <input class="autocomplete-input" v-if="!tagMode"
      type="text"
      :placeholder="placeholder"
      @input="onChange($event.target.value)"
      :value="value"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @click="onInputClick();"
    />
    <div id="autocomplete-results"  v-show="isOpen" class="autocomplete-results">
      <span class="loading" v-if="isLoading">Loading...</span>
      <span class="no-results" v-else-if="!isLoading && results.length == 0">
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
      value :{
        type: [Array, String],
        default: () => {
          return '';
        }
      },
      items: {
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
      textField: {
        type: String,
        required: false,
        default: ''
      },
      minChars: {
        type: Number,
        required: false,
        default: 2
      },
      placeholder: {
        type: String,
        required: false,
        default: ''
      },
      debounceDelay: {
        type: Number,
        required: false,
        default: 500
      },
      tagMode: {
        type: Boolean,
        required: false,
        default: false
      },
      tags: {
        type: Array,
        required: false,
        default: () => []
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

        debounceFunc: null,

        tagInputValue: ''
      };
    },
    methods: {
      tagRemoveClick(index) {
        this.$delete(this.tags, index)
        this.$emit('tagDeleted');
      },
      onInputClick() {
        var passesMin = this.tagMode ? this.passesMinChars(this.tagInputValue) : this.passesMinChars(this.value);
        var filterVal = this.tagMode ? this.tagInputValue : this.value
        if (passesMin) {
          if (this.isAsync) {
            this.isLoading = true;
            this.$emit('loadResults', filterVal);
            this.isOpen = true;
          } else {
            this.isOpen = true;
          }
        } else {
          if (!this.isAsync) {
            this.filterResults(filterVal);
            this.isOpen = true;
            this.isLoading = false;
          }
        }
      },
      passesMinChars(value) {
        if (value && value.length >= this.minChars) {
          return true;
        }
        return false;
      },
      onChange(val) {
        // Let's warn the parent that a change was made
        this.$emit('input', val);
        var vm = this;
        var passesMin = this.tagMode ? this.passesMinChars(this.tagInputValue) : this.passesMinChars(val);
        var filterVal = this.tagMode ? this.tagInputValue : val;
        if (passesMin) {
          if (this.isAsync) {
            clearTimeout(this.debounceFunc);
            this.debounceFunc = setTimeout(() => {
              vm.isLoading = true;
              vm.isOpen = true;
              this.$emit('loadResults', filterVal)
              }, vm.debounceDelay);
          } else {
            this.isOpen= true
            this.filterResults(filterVal);
          }
        } else {
          if (this.isAsync) {
            this.results = [];
            this.isOpen = false;
          } else {
            this.results = this.items;
          }
        }
      },
      filterResults(val) {
        // first uncapitalize all the things
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      },
      setResult(result, key) {
        if (this.isAsync) {
          if (this.tagMode) {
            this.tags.push(result[this.textField]);
          } else {
            this.$emit('input', result[this.textField]);
          }
        } else {
          if (this.tagMode) {
            this.tags.push(result);
          } else {
            this.$emit('input', result);
          }
        }
        
        this.$emit('itemSelected', result);
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

            if (this.tagMode) {
               this.tags.push(this.isAsync ? selectedResult[this.textField] : selectedResult);
            } else {
              this.$emit('input', this.isAsync ? selectedResult[this.textField] : selectedResult)
            }

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
        if (this.isAsync) {
          this.results = val;
          this.isLoading = false;
        } else {
          if (val.length !== oldValue.length) {
            this.results = val;
            this.isLoading = false;
          }
        }
      },
    },
    created() {
      if (this.tagMode) {
        if (this.value && this.value.length) {
          this.tags = this.value;
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    }
  };
</script>
<style scoped>
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
    border: 1px solid gray;
    overflow: auto;
    width: 100%;
    max-height: 350px;
    position: absolute;
    z-index: 9999;
  }

  .autocomplete-result, .loading, .no-results {
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

  .badge {
    color: #212529;
    background-color: #f0f1f2;
    padding-right: 0.6em;
    padding-left: 0.6em;
    border-radius: 10rem;
    margin-right: .5em;

    display: inline-block;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
  }

  .badge-remove {
    cursor: pointer;
    position: relative;
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
  }

  .badge-remove::before, .badge-remove:after {
    position: absolute;
    content: '';
    width: 100%;
    height: .125em;
    background-color: black;
  }

  .badge-remove::before {
    transform: rotate(45deg);
  }

  .badge-remove:after {
    transform: rotate(-45deg);
  }

  .tag-container {
    margin-bottom: .2em;
  }

</style>