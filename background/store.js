Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    // Values inside the 'synced' key will flow down to all connected tabs
    synced: {
      // Data for our example
      color: {
        r: 0,
        g: 0,
        b: 0
      },
      message: 'One store for all parts of your extension!'
    }
  },
  mutations: {
    // Mutations for our example data
    UPDATE_MESSAGE(state, message) {
      state.synced.message = message;
    },
    MAKE_ANGRY(state) {
      state.synced.color.r = (state.synced.color.r + 30) % 256;
    },
    MAKE_GREEDY(state) {
      state.synced.color.g = (state.synced.color.g + 30) % 256;
    },
    GIVE_BLUES(state) {
      state.synced.color.b = (state.synced.color.b + 30) % 256;
    }
  }
});

listenForMutations();

function listenForMutations() {
  chrome.runtime.onConnect.addListener(port => {
    if (port.name === 'VUEX_SYNC') {
      handlePortConnect(port);
      port.onMessage.addListener(msg => {
        handlePortMessage(msg, port);
      });
    }
  });
}

function handlePortConnect(port) {
  // Send down the initial state since we've just connected
  port.postMessage({ name: 'STATE_UPDATE', payload: store.state.synced });

  // Subscribe to state updates on the store, to send to this tab
  store.subscribe((mutation, state) => {
    port.postMessage({ name: 'STATE_UPDATE', payload: state.synced });
  });
}

function handlePortMessage(msg, port) {
  // A tab has broadcast a mutation, send it to the store
  if (msg.name === 'STATE_MUTATION') {
    store.commit(msg.details.name, msg.details.args);
  }
}
