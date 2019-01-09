import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.config.keyCodes = {
  num1: [49, 97],
  num2: [50, 98],
  num3: [51, 99],
  num4: [52, 100],
  num5: [53, 101],
  num6: [54, 102],
  num7: [55, 103],
  num8: [56, 104],
  num9: [57, 105],

  anyNumber: [
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105
  ]
};

Vue.prototype.$event = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
