const BASE_URL = "https://www.googleapis.com/youtube/v3/videos?";
const API_KEY = "AIzaSyCx-Xi2daaOrPmQl9Y8inmmDvmfbvsjUY8";
const Channel_URL="https://www.googleapis.com/youtube/v3/channels?";

const container = document.getElementById("videos-container");
const main_container = document.getElementById("main-container");

let sidebar=document.querySelector(".sidebar")
let hamburger=document.querySelector(".hamimg");
hamburger.onclick=function(){
  sidebar.classList.toggle("sidebar-none");
  main_container.classList.toggle("sidebar-none-container");
}
async function getVideos(q) {
    //const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&type=videos&maxResults=30`;
    const response = await fetch(BASE_URL+ new URLSearchParams({
      key: API_KEY,
      part: 'snippet,contentDetails,statistics',
      chart:'mostPopular',
      maxResults:20,
      regionCode: 'IN',
    }))
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      const videos = data.items;
      getVideoData(videos);
    })
    .catch(err=>(console.log(err)));
    
   
     
  }
  
  async function getVideoData(videos) {
    
    renderVideos(videos);
  }

  async function combineChannel(video){
    

      let url="";
        const channelid=video.snippet.channelId;
        await fetch(Channel_URL+ new URLSearchParams({
          key:API_KEY,
          part:'snippet',
          id: channelid,
        }))
        .then(res=>{
          //console.log(res);
          return res.json();
        })
        .then(data=>{
          
          url= data.items[0].snippet.thumbnails.default.url;
          console.log(url);
            //video.channelThumbnail=data.items[0].snippet.thumbnails.default.url;
        })
        .catch(err=>{
          console.log(err);
          
        })
      
      return url;
      

      
     
  
  }
  
  // async function getVideoDetails(videoId) {
  //   const url = `${BASE_URL}/videos?key=${API_KEY}&part=
  //   snippet,contentDetails,statistics&id=${videoId}`;
  //   const response = await fetch(url, {
  //     method: "get",
  //   }).catch(err=>console.log(err));
  //   const data = await response.json();
  //   return data.items[0];
  // }

//   async function channelDetails(channelid){
//     const channelUrl= `${BASE_URL}/channelSections?key=
//       ${API_KEY}&part=snippet&channelId=${channelid}&key=${API_KEY}`;
      
//         const newdata=await fetch(channelUrl).then(
//         res=>res.json()
//       ).then(res=>{
//         console.log(res.items[0].snippet.thumbnails.default.url);
//         return res.items[0].snippet.thumbnails.default.url;
//       }).catch(err=>console.log(err));
//   return newdata;
// }
  async function renderVideos(videos) {
    container.innerHTML = ``;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const thumbnailUrl = video.snippet.thumbnails.medium.url;
      let thisurl=await combineChannel(video);
      console.log(thisurl);
      
      
     
      
      
      
      container.innerHTML += `
      <div class="video-info" onclick="openVideoDetails('${video.id}')" >
          <div class="video-image">
            <img src="${thumbnailUrl}" alt="video thumbnail" />
          </div>
          <div class="video-description">
            <div class="icon-title">
              <div class="channel-avatar">
                <img src="${thisurl}" alt="channel avatar" />
              </div>
              <div class="video-title">${video.snippet.localized.title}</div>

            </div>
            <div class="channel-description">
              <p class="channel-name">${video.snippet.channelTitle}</p>
              <p class="video-views">${video.statistics.viewCount+" views. 1week ago"}</p>
              
            </div>
          </div>
        </div>
        `;
    }
  }
  
  function openVideoDetails(videoId) {
    localStorage.setItem("videoId", videoId);
    window.open("/videoDetails.html");
  }
  
 getVideos("");