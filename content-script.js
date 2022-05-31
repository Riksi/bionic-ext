function toBionic(checked, highlightLevel, fontFamily, category){
    function toBionicInner(checked, highlightLevel, fontFamily){
      const EXCLUDE = ['SCRIPT', 'STYLE'];
      var newNodes = {};
      function sigmoid(x){
          return 1 / (1 + Math.exp(-x))
      }
    
      function makeSpan(tkn, highlightLevel, extra, fontFamily){
        let span = document.createElement('span');
        let s = tkn.length;
        let b = sigmoid(s) / 6.;
        let size = s * (1/ 3. + b)
        size = ((highlightLevel == "low") ? Math.round : Math.ceil)(size)
        let start = tkn.slice(
            0, size
        )
        let end = tkn.slice(size)
        let startSpan = document.createElement('span');
        let endSpan = document.createElement('span');
        startSpan.innerText = start;
        endSpan.innerText = end + extra
        startSpan.className = "bionic-start"
        endSpan.className = "bionic-end"
        span.appendChild(startSpan);
        span.appendChild(endSpan);
        span.className = "bionic-outer"
        
        startSpan.style.fontWeight = "bold";
        endSpan.style.fontWeight = "lighter";
        span.style.fontFamily = fontFamily;
    
        return span
      }
  
      function changeFontFamily(fontFamily){
        let spans = Array.from(document.querySelectorAll(".bionic-outer"));
        spans.forEach((span)=>{
          span.style.fontFamily = fontFamily
        })
      }
      
      function processText(text, highlightLevel, fontFamily){
          let tkns = text.split(" ")
  
          tkns = tkns.filter((x)=> x.trim().length > 0)
          return tkns.map(
              (tkn, idx)=>{
                  return makeSpan(tkn, highlightLevel,
                     ((idx + 1) < tkns.length) ? " " : "", fontFamily)
              }
          ) 
          }
      
      function replaceText(p, highlightLevel, fontFamily){
          if (p in newNodes){
              return
          }
          if(p.childNodes === undefined){
              return;
          }
          if (EXCLUDE.indexOf(p.nodeName) >= 0){
              
              return;
          }
          let childNodes = Array.from(p.childNodes)
          childNodes.forEach(
              (node, idx)=>{
                  if(node.nodeName == "#text"){
                      let processed = processText(node.wholeText, highlightLevel, fontFamily)
                      if (processed.length > 0){
                          p.replaceChild(processed[0], node)
                          processed.slice(1).forEach(
                          (x)=>{
                              if (x.nodeName != "BR"){
                                  if (idx == (childNodes.length - 1)){
                                      p.appendChild(x)
                                  }
                                  else{
                                      p.insertBefore(x, childNodes[idx + 1])
                                  }
                              }
                              
                              newNodes[x] = 1;
                          }
                      )
                      }
                      
                  }
                  else{
                      replaceText(node, highlightLevel, fontFamily);
                  }
          
              }
          )
      }
      
    let bionicIsActive = document.querySelector('.bionic-outer') != null;
    if(checked){
        if(category == "activate"){
        if(!bionicIsActive){
            console.log("making bionic");
            replaceText(document.querySelector('body'), highlightLevel, fontFamily);
        }
        }
        if(category=="font"){
            console.log("changing font family");
            changeFontFamily(fontFamily);
        } 
    } else {
        if(category == "activate"){
        location.reload();
        }
    }
    }
    toBionicInner(checked, highlightLevel, fontFamily);
    
  }
  
chrome.storage.onChanged.addListener(function (changes, namespace) {
    
    chrome.storage.sync.get(
        ["checked", "highlightLevel", "font"],
        (state) => {
            // console.log("storage.onChanged")
            // console.log("changes", changes);
            let changed = {}
            for (let [name, { oldValue, newValue }] of Object.entries(changes)) {
                changed[name] = true;
            }
            // console.log("changed", changed);
            let state2 = {"checked":"checked" in state ? state.checked : false, 
                          "highlightLevel":"highlightLevel" in state ? state.highlightLevel : "low", 
                          "font": "font" in state ? state.font : "inherit"}
            if(changed["checked"] && (state.checked !== undefined)){
                toBionic(state2.checked, state2.highlightLevel, state2.font, "activate")
            } else {
                if(changed["font"] && (state.font !== undefined)){
                    toBionic(state2.checked, state2.highlightLevel, state2.font, "font")
                }
            }   
        }
    )
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        chrome.storage.sync.get(
            ["checked", "highlightLevel", "font"],
            (state) => {
                // console.log("state: ", state, ", function: ", request.function)
                // console.log(request.function)
                toBionic(
                    "checked" in state ? state.checked : false, 
                    "highlightLevel" in state ? state.highlightLevel : "low", 
                    "font" in state ? state.font : "inherit", 
                    "activate")
            }
        )
    }
  );
