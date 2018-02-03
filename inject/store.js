Vue.use(Vuex);

let port = connectBackground();
var store = syncedStore(port);

function syncedStore(port) {
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
    port.postMessage({ name: 'STATE_MUTATION', details: { name, args } });
  };

  return store;
}

function connectBackground() {
  let port = chrome.runtime.connect({ name: 'VUEX_SYNC' });

  // Incoming state from the background script
  port.onMessage.addListener(message => {
    if (message.name === 'STATE_UPDATE') {
      store.commit('REMOTE_STATE_UPDATE', message.payload);
    }
  });

  return port;
}
