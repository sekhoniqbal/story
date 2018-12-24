window.onload = function(){
  main();
};




function main(){
  var stories = localStorage.stories? JSON.parse(localStorage.stories): null;
  var words = localStorage.words? JSON.parse(localStorage.words): [];
  var currentStoryIndex = null;
  var unHiddenListTip = null;
  var infoObj = {
    word:"",
    meaning:""
  };

  document.querySelector("#app #allpages #makefontbig").addEventListener("click",increaseFontSize);
  document.querySelector("#app #allpages #makefontsmall").addEventListener("click",decreaseFontSize);
  document.querySelector("#app .page1 #storylist #searchStory").addEventListener("keyup",filterStorylist);

  if(!stories) {
    fetch("https://sekhoniqbal.ddns.net:3000/stories")
    .then(a=>a.json())
    .then(a=>{stories = a; openStoryList(); updateLocal("stories");})
    .catch(a=>console.log(a));
  }
  else{
     openStoryList();
  }



//functions to load story list or story page
function openStoryList(){
    document.querySelector(".page1").classList.remove("hide");
    document.querySelector(".page2").classList.add("hide");
    loadstorylist();
    loadNewWords();
    loadLearnedWords();
    loadDeletedWords();

  }
function openStory(event){
  document.querySelector(".page2").classList.remove("hide");
  document.querySelector(".page1").classList.add("hide");
  currentStoryIndex = event.target.id;
  loadstory(event.target.id);
  loadstoryButtons();
  loadmyCurrentWords();
  markWords();
  markWordsfromCurrentStory();
}
// functions to load html for differnt parts of the application
function loadstorylist(storylist=stories){
  document.querySelector("#storylist ol").innerHTML = storylist.map((a,i)=>{
    let noOfnewWords = words.filter(b=>b.storyindex==i && b.state=="newword").length;
    let noOflearntWords = words.filter(b=>b.storyindex==i && b.state=="learnt").length;
    let html = `<li id="${i}">${a.title} `;
    if(a.read) html+= `<span>&#10004;Read</span>`;
    if(noOfnewWords) html +=`<span class="update newword">${noOfnewWords}</span>`
    if(noOflearntWords) html +=`<span class="update learnt">${noOflearntWords}</span>`

    html+=`</li>`
    return html;
  }).join("\n");
  document.querySelectorAll("#storylist ol li").forEach(a=>{a.addEventListener('click', openStory)});
}
function loadNewWords(){
  //adding
  let newwords = words.filter(a=>a.state=="newword");
  document.querySelector("#app #wordlist h2").innerHTML = `Words you are learning <span class="update newword">${newwords.length}<span>`;
  document.querySelector("#app #wordlist ol").innerHTML = newwords.map((a)=>
  `<li id="${a.id}">${a.word}
      <div class="cooltip maxheightzero">
      <span class="fromStory">fromStory: ${stories[a.storyindex].title}<span>
      <button id=${a.id} class=" btn btn-danger deleteword">Delete Word</button>
      <button id=${a.id} class="btn btn-success learnedword">Mark as Learnt</button>
      <button class="btn btn-primary openstory" id=${a.storyindex}>Open Story</button>
      <div>
  </li>`
).join("\n");

document.querySelectorAll("#app #wordlist ol li").forEach(a=>{a.addEventListener("click",showcooltip )});
document.querySelectorAll("#app #wordlist ol li .cooltip .openstory").forEach(a=>{a.addEventListener("click", openStory)});
document.querySelectorAll("#app #wordlist ol li .cooltip .deleteword").forEach(a=>{a.addEventListener("click", markWordasDeleted)});
document.querySelectorAll("#app #wordlist ol li .cooltip .learnedword").forEach(a=>{a.addEventListener("click", markWordasLearned)});

}
function loadLearnedWords(){
  let learnedwords = words.filter(a=>a.state=="learnt");
  document.querySelector("#app #words #learnedwordlist h2").innerHTML = `Words you have learnt <span class="update learnt">${learnedwords.length}<span>`;
  document.querySelector("#app #words #learnedwordlist ol").innerHTML = learnedwords.map((a)=>
  `<li id="${a.id}">${a.word}
      <div class="cooltip maxheightzero">
      <span class="fromStory">fromStory: ${stories[a.storyindex].title}<span>
      <button id=${a.id} class=" btn btn-danger deleteword">Delete Word</button>
      <button id=${a.id} class="btn btn-warning newword">Mark as New Word</button>
      <button class="btn btn-primary openstory" id=${a.storyindex}>Open Story</button>
      <div>
  </li>`
).join("\n");
document.querySelectorAll("#app #learnedwordlist ol li").forEach(a=>{a.addEventListener("click",showcooltip )});
document.querySelectorAll("#app #learnedwordlist ol li .cooltip .openstory").forEach(a=>{a.addEventListener("click", openStory)});
document.querySelectorAll("#app #learnedwordlist ol li .cooltip .deleteword").forEach(a=>{a.addEventListener("click", markWordasDeleted)});
document.querySelectorAll("#app #learnedwordlist ol li .cooltip .newword").forEach(a=>{a.addEventListener("click", markWordasNewWord)});
}
function loadDeletedWords(){
  let deletedwords = words.filter(a=>a.state=="deleted");
  document.querySelector("#app #words #deletedwordlist h2").innerHTML = `Words you Deleted <span class="update deleted">${deletedwords.length}<span>`;
  document.querySelector("#app #words #deletedwordlist ol").innerHTML = deletedwords.map((a)=>
  `<li id="${a.id}">${a.word}
      <div class="cooltip maxheightzero">
      <span class="fromStory">fromStory: ${stories[a.storyindex].title}<span>
      <button id=${a.id} class="btn btn-warning newword">Mark As New Word</button>
      <button id=${a.id} class="btn btn-success learnedword">Mark as Learnt</button>
      <button class="btn btn-primary openstory" id=${a.storyindex}>Open Story</button>
      <div>
  </li>`
).join("\n");
document.querySelectorAll("#app #deletedwordlist ol li").forEach(a=>{a.addEventListener("click",showcooltip )});
document.querySelectorAll("#app #deletedwordlist ol li .cooltip .openstory").forEach(a=>{a.addEventListener("click", openStory)});
document.querySelectorAll("#app #deletedwordlist ol li .cooltip .newword").forEach(a=>{a.addEventListener("click", markWordasNewWord)});
document.querySelectorAll("#app #deletedwordlist ol li .cooltip .learnedword").forEach(a=>{a.addEventListener("click", markWordasLearned)});
}

function loadstory(){
  document.querySelector("#story #heading").innerHTML = stories[currentStoryIndex].title;
  document.querySelector("#story #body").innerHTML = stories[currentStoryIndex].paragraphs.map(a=>`<p>${a.split(" ").map(a=>`<span c>${a} </span>`).join("")}</p>`).join("\n");
  wordspan = document.querySelectorAll("#story #body span");
  wordspan.forEach(a=>a.addEventListener("click", hightlight));
}

function loadstoryButtons(){
  markStoryASReadButton =document.querySelector("#story #markasread");
  if(stories[currentStoryIndex].read) {
    markStoryASReadButton.innerHTML="Mark Story as not Read";
    markStoryASReadButton.classList.remove("btn-success");
    markStoryASReadButton.classList.add("btn-danger");
  }
  else {markStoryASReadButton.innerHTML="Mark Story as Read";
  markStoryASReadButton.classList.remove("btn-danger");
  markStoryASReadButton.classList.add("btn-success");
}
  document.querySelector("#story #goback").addEventListener("click", openStoryList);
  document.querySelector("#story #addword").addEventListener("click", addWord);
  document.querySelector("#story #markasread").addEventListener("click", markStoryAsRead);
}
function loadmyCurrentWords(){
  document.querySelector("#app .page2 #story #currentwords ol").innerHTML=words.filter(a=>a.storyindex==currentStoryIndex && a.state=="newword").map(a=>`<li>${a.word}</li>`).join("\n");
};

//funtion to hide and show cooltip for the word list
function showcooltip(){
  let element = event.target.querySelector("div");
  if ( unHiddenListTip && unHiddenListTip!=element){unHiddenListTip.classList.add("maxheightzero")}
  if(element.classList.contains("maxheightzero")) {element.classList.remove("maxheightzero");unHiddenListTip=element;}
  else{element.classList.add("maxheightzero"); unHiddenListTip=null;}

}
//function to add word to list of words
function addWord(){
  var markedwords = Array.from(document.querySelectorAll("#story #body p .marked")).map(a=>a.innerText);
  markedwords = markedwords.map(a=>/[a-z]+/i.exec(a)[0].toLowerCase());  //removes any extra characters from the words like ' . "" etc and then makes i lowercase

// for each word checks that word is not null and it doesnt exist in the word list. if not add it
  markedwords.forEach(word=>{
  if(words.find(a=>a.word==word)){words.find(a=>a.word==word).state="newword";}
   else if(word) words.push({word, storyindex: currentStoryIndex,state:"newword",id:words.length});
 });
  // updates the local storage of words.
  updateLocal("words");
  document.querySelectorAll("#story #body p .marked").forEach(a=>a.classList.remove("marked")) ; //remove the marked tag from the words.
  loadmyCurrentWords();
  markWords();
  markWordsfromCurrentStory();

}
//functions to change state of the words of the user.
function markWordasLearned(event){
  element = event.target;
  let wordindex = element.id;
  words[wordindex].state="learnt";
  loadNewWords();
  loadDeletedWords();
  loadLearnedWords();
  updateLocal("words");
}
function markWordasDeleted(event){
  element = event.target;
  let wordindex = element.id;
  words[wordindex].state="deleted";
  loadNewWords();
  loadDeletedWords();
  loadLearnedWords();
  updateLocal("words");
}
function markWordasNewWord(event){
  element = event.target;
  let wordindex = element.id;
  words[wordindex].state="newword";
  loadNewWords();
  loadDeletedWords();
  loadLearnedWords();
  updateLocal("words");

}
// functions to highlight words in a story.
function markWords(){
  let wordarray =  words.filter(a=>a.state=="newword").map(a=>a.word);
  Array.from(document.querySelectorAll("#story #body p span")).forEach(a=>{
   let word=trimWord(a.innerText);
  if(word && wordarray.includes(word)) a.classList.add("newword");
  });
}
function markWordsfromCurrentStory(){
  let wordarray =  words.filter(a=>a.state=="learnt").map(a=>a.word);
  Array.from(document.querySelectorAll("#story #body p span")).forEach(a=>{
    let word= /[a-z]+/i.exec(a.innerText);
    if(word) word = word[0].toLowerCase();
  if(wordarray.includes(word)) a.classList.add("learnt");
  });
}
function hightlight(event){
  event.target.classList.toggle("marked");
  infoObj.word = trimWord(event.target.innerText);
  translate(infoObj.word);
}

function trimWord(text){
   let word= /[a-z]+/i.exec(text);
   if(word){ word = word[0].toLowerCase();
   return word;
    }
  else return "";
}

function updateInfoBox(){
    document.querySelector("#infobox").innerHTML=`
    <div style="padding:5px">
    <span>Word: ${infoObj.word}</span>
    <br>
    <span>Meaning: ${infoObj.meaning}</span>
    <br>
    <button class="close" onclick='toggle(event.target.parentElement,"hide")'></button>
    <div>
    `;
}
test=updateInfoBox;
async function translate(sourceText, sourceLang = "en", targetLang = "pa"){
  var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
           + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

 var result = await fetch(url).then(a=>a.json());
 translatedText = result[0][0][0];
 infoObj.meaning = translatedText;
 updateInfoBox();


}

//function to increase and derease size of text in the application
function increaseFontSize(){
  let currentsize = document.body.style.fontSize ? document.body.style.fontSize : "16px";
  document.body.style.fontSize =  (parseInt(currentsize)+1)+"px";
}
function decreaseFontSize(){
  let currentsize = document.body.style.fontSize ? document.body.style.fontSize : "16px";
  document.body.style.fontSize =  (parseInt(currentsize)-1)+"px";
}


// function to update  local state of the application
function updateLocal(item){
    switch(item){
      case "stories": localStorage[item] = JSON.stringify(stories); break;
      case "words":   localStorage[item] = JSON.stringify(words); break;
    }


  }
function markStoryAsRead(){
  if(currentStoryIndex && stories[currentStoryIndex].read) {
    stories[currentStoryIndex].read=false;
    document.querySelector("#story #markasread").innerHTML="Mark Story as Read";
    document.querySelector("#story #markasread").classList.remove("btn-danger");
    document.querySelector("#story #markasread").classList.add("btn-success");

  }
  else if (currentStoryIndex) {
    stories[currentStoryIndex].read=true;
    document.querySelector("#story #markasread").innerHTML="Mark Story as not Read";
    document.querySelector("#story #markasread").classList.add("btn-danger");
    document.querySelector("#story #markasread").classList.remove("btn-success");
  }


     updateLocal("stories");
  }
  /////////////filter story listens
  function filterStorylist(event){
    let filter = event.target.value;
    let filteredStories = stories.filter(a=>a.title.toLowerCase().includes(filter.toLowerCase()));
    loadstorylist(filteredStories);

  }

  //event listens for buttons to clear all local data
document.querySelector("#app #allpages #cleardata1").addEventListener("click", ()=>{document.querySelector("#app #allpages .warning").classList.remove("hide")});
document.querySelector("#app #allpages #goback").addEventListener("click", ()=>{document.querySelector("#app #allpages .warning").classList.add("hide")} );

}

//external function
var test;
function toggle(element, className){
  element.classList.toggle(className)

  //new code to be testied for paragraphs
  //for creating html
  text = paragraph.map(p=>`<p>${p.map(l=>`<span class="line">${l.map(word=>`<span>${word}</span>`).join("\n")}</span>`).join("\n")}</p>`).join("\n")
//for creating array of lines
paragraph.forEach((a,i)=>paragraph[i]=a.split("."))
//for creating array of words inside lines
paragraph.forEach(p=>p.forEach((l,li)=>p[li]=l.split(" ")))


    }
