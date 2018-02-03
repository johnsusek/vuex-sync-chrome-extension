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

// Subscribe to state updates on the store, to send to this tab
store.subscribe((mutation, state) => {
  // TODO: track STATE_INITIAL senders, and only send to them
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        name: 'STATE_UPDATE',
        payload: state.synced
      });
    });
  });
});

// Listen to incoming mutations
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'STATE_MUTATION') {
    // A tab has sent up a mutation
    store.commit(request.details.name, request.details.args);
  } else if (request.name === 'STATE_INITIAL') {
    // A tab has requested initial state
    chrome.tabs.sendMessage(sender.tab.id, {
      name: 'STATE_UPDATE',
      payload: store.state.synced
    });
  }
});
