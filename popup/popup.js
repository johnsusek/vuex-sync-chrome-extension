// Popups can access the store object from the background script,
// so no need to do syncing here.
let bg = chrome.extension.getBackgroundPage();
let store = bg.store;

let app = new Vue({
  el: '#app',
  computed: {
    style() {
      if (!this.color) return;
      let { r, g, b } = this.color;
      return `color: rgb(${r}, ${g}, ${b});`;
    }
  },
  data() {
    return {
      color: store.state.synced.color,
      message: store.state.synced.message
    };
  },
  methods: {
    giveBlues() {
      store.commit('GIVE_BLUES');
    },
    makeAngry() {
      store.commit('MAKE_ANGRY');
    }
  }
});
