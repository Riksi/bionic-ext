

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.sync.get(["checked"], (state)=>{
    if(("checked" in state) && state.checked){
      chrome.tabs.sendMessage(
        tabId, {function: "onUpdated"}, null)
    }
  })
}
)

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.sync.get(["checked"], (state)=>{
    if(("checked" in state) && state.checked){
      chrome.tabs.sendMessage(
        tabId, {function: "onActivated"}, null)
    }
  })
}
)

// chrome.runtime.onConnect.addListener(port => {
//   console.log('connected ', port);

//   if (port.name === 'hi') {
//     port.onMessage.addListener(this.processMessage);
//   }
// });