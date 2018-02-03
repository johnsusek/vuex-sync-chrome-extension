// For this example, we just inject to the top of every webpage
let template = `
  <div id="example-injected-app" style="position:relative;z-index:99999;">
    <div :style="style" style="width: 100%; height: 200px;"></div>
    <pre>{{ message }}</pre>
    <button @click="makeAngry">ANGRY!</button>
    <button @click="makeGreedy">Greed++</button>
  </div>
`;
document.body.insertAdjacentHTML('afterBegin', template);

let app = new Vue({
  store,
  el: '#example-injected-app',
  computed: {
    style() {
      if (!this.color) return;
      let { r, g, b } = this.color;
      return `background-color: rgb(${r}, ${g}, ${b});`;
    },
    color() {
      return this.$store.state.synced.color;
    },
    message() {
      return this.$store.state.synced.message;
    }
  },
  methods: {
    makeAngry() {
      this.$store.broadcast('MAKE_ANGRY');
    },
    makeGreedy() {
      this.$store.broadcast('MAKE_GREEDY');
    }
  }
});

console.log(app);
