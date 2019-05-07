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
    <ul id="autocomplete-results"  v-show="isOpen" class="autocomplete-results">
      <li class="loading" v-if="isLoading">
        Loading...
      </li>
      <li
        v-else
        v-for="(result, i) in results" :key="i" @click="setResult(result)" class="autocomplete-result" :class="{ 'is-active': i === arrowCounter }">
        {{result[textField] }}
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    
    /* eslint-disable */
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
        default: false
      },
      textField: {
        type: String,
        required: false,
        default: false
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
      };
    },
    methods: {
      onInputClick() {
        if (this.value && this.value.length>= 4) {
           if (this.results.length > 0) {
             this.isOpen = true;
           }
        }
      },
      onChange(val) {
        // Let's warn the parent that a change was made
        this.$emit('input', val);

        if (val && val.length >=4) {
          // Is the data given by an outside ajax request?
          if (this.isAsync) {
              this.isLoading = true;
              this.isOpen = true;
              this.$emit('loadResults', val)
          } else {
              // Let's  our flat array
              this.filterResults();
              this.isOpen = true;
          }
        }

      },

      filterResults() {
        // first uncapitalize all the things
        this.results = this.items.filter((item) => {
          return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
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
        this.search = this.results[this.arrowCounter];
        this.isOpen = false;
        this.arrowCounter = -1;
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
    white-space: pre;
    line-height: 60%;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }

</style>