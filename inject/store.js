Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    // Values inside the 'synced' object will be updated
    // from the background store automatically
    synced: {}
  },
  mutations: {
    // Incoming mutations from background script
    REMOTE_STATE_UPDATE(state, remoteState) {
      // Definitely room for some optimization here
      // - RPC mutations individually from background?
      // - Recursive algorithm to only update local state where it diffs?
      // - Use json-diff type tool to iterate over change set?
      state.synced = remoteState;
    }
  }
});

// Like a Vuex action, but sends it to a remote store on a port instead.
// Remote state will flow back down through the port and be reflected locally.
store.broadcast = function(name, args) {
  chrome.runtime.sendMessage({
    name: 'STATE_MUTATION',
    details: { name, args }
  });
};

// Listen to incoming state changes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'STATE_UPDATE') {
    store.commit('REMOTE_STATE_UPDATE', request.payload);
  }
});

chrome.runtime.sendMessage({ name: 'STATE_INITIAL' });
