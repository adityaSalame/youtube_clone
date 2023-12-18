const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyCx-Xi2daaOrPmQl9Y8inmmDvmfbvsjUY8";
const Channel_URL="https://www.googleapis.com/youtube/v3/channels?";

let sidebar=document.querySelector(".side-none");
let hamburger=document.querySelector(".hamimg");
hamburger.onclick=function(){
  sidebar.classList.toggle("sidebar-video");
  main_container.classList.toggle("sidebar-none-container");
}


const video_container = document.getElementById("yt-video");
let videodetails= JSON.parse(localStorage.getItem("videoDetails"));
console.log(videodetails);
//id,thumbnailUrl,channelimg,title,channeltitle,viewcount
let title=videodetails[3];
let videoId=videodetails[0];
let channelimg=videodetails[2];
let thumbnailUrl=videodetails[1];
let channelTitle=videodetails[4];
let viewCount=videodetails[5];
let channelId=videodetails[6];
const commentno=document.getElementById("commentno");
const commentsContainer = document.getElementById("comments");

video_container.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

async function dataChannel(channelid){
    
  console.log(channelid);
  let data;
    await fetch(Channel_URL+ new URLSearchParams({
      key:API_KEY_1,
      part:'snippet,statistics',
      id: channelid,
    }))
    .then(res=>{
      //console.log(res);
      return res.json();
    })
    .then(res=>{
      
      
      console.log("->",res.items[0]);
      data=res.items[0];
      
        //video.channelThumbnail=data.items[0].snippet.thumbnails.default.url;
    })
    .catch(err=>{
      console.log(err);
      
    })
  console.log(1);
  return data;
  

}



async function getComments() {
  const url = `${BASE_URL_1}/commentThreads?key=${API_KEY_1}&videoId=${videoId}&maxResults=80&order=time&part=snippet`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();

  const comments = data.items;

  renderComments(comments);
}

async function allDetails(){
  const data=await fetch(BASE_URL_1+"/videos?"+new URLSearchParams({
    key: API_KEY_1,
    part: 'snippet,contentDetails,statistics',
    id: videoId,
  }))
  .then(res=>res.json())
  .then(data=>{
    console.log(data.items);
   return data.items[0];
  })
  .catch(err=>{console.log(err); return"";});
  //console.log(data);
  let liked=data.statistics.viewCount;

  let channeldata=await dataChannel(channelId);
  let subscribers=channeldata.statistics.subscriberCount;
  document.getElementById("subs").innerHTML=`${subscribers}`;

  document.getElementById("avatar").innerHTML=`<img src="${channelimg}">`;

  document.getElementById("likes-num").innerHTML=`${liked}`;

  document.getElementById("title").innerHTML=`${data.snippet.localized.title}`;

  document.getElementById("description-section").innerHTML=`${data.snippet.localized.description}`;

  document.getElementById("ch-name").innerHTML=`${data.snippet.channelTitle}`;
  
  commentno.innerHTML=`${data.statistics.commentCount} Comments`;

}
allDetails();


function renderComments(comments) {
  
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => {
    //console.log(comment.snippet);
    commentsContainer.innerHTML += `
        <div class="eachcomment">
          <div class="channel-avatar"><img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}"></div>
          <div class="eachcomment-detail">
            <div class="eachcomment-name-update">
              <div class="name">${comment.snippet.topLevelComment.snippet.authorDisplayName}</div>
              <div class="update">${comment.snippet.topLevelComment.snippet.updatedAt}</div>
            </div>
            <div class="comment">
              <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
            </div>
          
          </div>
        </div>
    `;
  });
}

getComments();