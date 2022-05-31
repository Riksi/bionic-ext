// Initialize butotn with users's prefered color
let makeBionic = document.getElementById("makeBionic");
let fontInherit = document.getElementById('fontInherit')
let fontSansSerif = document.getElementById('fontSansSerif')
let fontChoice = Array.from(document.querySelectorAll('[name="font"]'))


chrome.storage.sync.get(["checked", "font"], (state)=>{
  makeBionic.checked = ('checked' in state) && state.checked;
  if ('font' in state){
    if (state.font == "inherit"){
      fontInherit.checked = true;
    }
    else{
      fontSansSerif.checked = true;
    }
  }
})


async function printIt(values){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: (values)=>{
      console.log(values)
    },
    args: values
    });
  }

 makeBionic.addEventListener("change", 
  ()=>{updateStorage()}
);

fontChoice.forEach((elem)=>{
  elem.addEventListener("change", ()=>{updateStorage()})
})
// When the button is clicked, inject setPageBackgroundColor into current page
async function updateStorage(){
    chrome.storage.sync.set(
      {
        "checked": makeBionic.checked,
        "highlightLevel": "low",
        "font": fontInherit.checked ? "inherit" : "sans-serif"
      }
    )
  }



  



// function toBionic(checked, highlightLevel, fontFamily, category){
//   function toBionicInner(checked, highlightLevel, fontFamily){
//     const EXCLUDE = ['SCRIPT', 'STYLE'];
//     var newNodes = {};
//     function sigmoid(x){
//         return 1 / (1 + Math.exp(-x))
//     }
  
//     function makeSpan(tkn, highlightLevel, extra, fontFamily){
//       let span = document.createElement('span');
//       let s = tkn.length;
//       let b = sigmoid(s) / 6.;
//       let size = s * (1/ 3. + b)
//       size = ((highlightLevel == "low") ? Math.round : Math.ceil)(size)
//       let start = tkn.slice(
//           0, size
//       )
//       let end = tkn.slice(size)
//       let startSpan = document.createElement('span');
//       let endSpan = document.createElement('span');
//       startSpan.innerText = start;
//       endSpan.innerText = end + extra
//       startSpan.className = "bionic-start"
//       endSpan.className = "bionic-end"
//       span.appendChild(startSpan);
//       span.appendChild(endSpan);
//       span.className = "bionic-outer"
      
//       startSpan.style.fontWeight = "bold";
//       endSpan.style.fontWeight = "lighter";
//       span.style.fontFamily = fontFamily;
  
//       return span
//     }

//     function changeFontFamily(fontFamily){
//       let spans = Array.from(document.querySelectorAll(".bionic-outer"));
//       spans.forEach((span)=>{
//         span.style.fontFamily = fontFamily
//       })
//     }
    
//     function processText(text, highlightLevel, fontFamily){
//         let tkns = text.split(" ")

//         tkns = tkns.filter((x)=> x.trim().length > 0)
//         return tkns.map(
//             (tkn, idx)=>{
//                 return makeSpan(tkn, highlightLevel,
//                    ((idx + 1) < tkns.length) ? " " : "", fontFamily)
//             }
//         ) 
//         }
    
//     function replaceText(p, highlightLevel, fontFamily){
//         if (p in newNodes){
//             return
//         }
//         if(p.childNodes === undefined){
//             return;
//         }
//         if (EXCLUDE.indexOf(p.nodeName) >= 0){
            
//             return;
//         }
//         let childNodes = Array.from(p.childNodes)
//         childNodes.forEach(
//             (node, idx)=>{
//                 if(node.nodeName == "#text"){
//                     let processed = processText(node.wholeText, highlightLevel, fontFamily)
//                     if (processed.length > 0){
//                         p.replaceChild(processed[0], node)
//                         processed.slice(1).forEach(
//                         (x)=>{
//                             if (x.nodeName != "BR"){
//                                 if (idx == (childNodes.length - 1)){
//                                     p.appendChild(x)
//                                 }
//                                 else{
//                                     p.insertBefore(x, childNodes[idx + 1])
//                                 }
//                             }
                            
//                             newNodes[x] = 1;
//                         }
//                     )
//                     }
                    
//                 }
//                 else{
//                     replaceText(node, highlightLevel, fontFamily);
//                 }
        
//             }
//         )
//     }
//   chrome.storage.sync.set(
//     { 'checked' : checked, "highlightLevel": highlightLevel, "loaded": true},
//     ()=>{
//       let bionicIsActive = document.querySelector('.bionic-outer') != null;
//       if(checked){
//         if(category == "activate"){
//           if(!bionicIsActive){
//             console.log("making bionic");
//             replaceText(document.querySelector('body'), highlightLevel, fontFamily);
//           }
//         }
//         if(category=="font"){
//           console.log("changing font family");
//           changeFontFamily(fontFamily);
//         } 
//       } else {
//         if(category == "activate"){
//           location.reload();
//         }
//       }
//     }
//   );
    
//   }
  
//   toBionicInner(checked, highlightLevel, fontFamily);
  
// }

