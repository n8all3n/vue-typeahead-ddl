import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';

Vue.config.productionTip = false

if (window.location.origin === 'http://localhost:8080') {
  axios.defaults.baseURL = 'http://localhost:62737';
} else {
  if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = window.location.origin + "/WorkOrderManagement";
  } else {
    axios.defaults.baseURL = window.location.origin;
  }
}

axios.defaults.headers.common['Authorization'] = 'Bearer Y6wkfMNmLYi2mHnwCqN3AKer6dT--G5PGFbcEfujEIs2oGrU9t5GjpHf5M509uENIW3h1kMmlNNxE4TOUxaNcmU-ZX3FBXncon-biEnQAhMmOPW8dmm24bXFnuOFGw_vEISfOiC5XtZOCaaWQjh6tHbwnPeuDIWryB8KT192x8iy_2iKyAUKEZmnSLpq2UL4-HvovVnVI9g-2U_f8aLtwTL2ctu1mQSbOPR4qDemBt0tTdn23KakvVoqXVDPh2gfk2PO5ALiIHV2eh42bBlzfeo1sli1ftLvJ4lgmF8ADkz0tBntJXOJ1fQWDE8WmbimUvCRx5byTt4274A7-fZGU9ied8F1pCFvwZd2AeChnkS4JZRnS-nWPx1bgedLh0QqK9IsKlaFi3CmfasPuif-HK94HYAUKw0kIub1KkUGE-82HzK36NoL0fovXYm0qX1xKlEt0bbJhQEE3QiPPj0K13HpuI4TILa1dSRZ_7dDoXeMDmnrGysqn6OK67c-Dc9owhi-jH7KgSupz1nahkhiiA';


new Vue({
  render: h => h(App),
}).$mount('#app')
