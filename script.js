const BASE_URL = "https://www.googleapis.com/youtube/v3/videos?";
const API_KEY = "AIzaSyCx-Xi2daaOrPmQl9Y8inmmDvmfbvsjUY8";
const Channel_URL="https://www.googleapis.com/youtube/v3/channels?";

const container = document.getElementById("videos-container");
const main_container = document.getElementById("main-container");

let sidebar=document.querySelector(".sidebar");
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

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const timeDifference = now - date;

    const minute = 60 * 1000; // milliseconds in a minute
    const hour = minute * 60; // milliseconds in an hour
    const day = hour * 24; // milliseconds in a day
    const week = day * 7; // milliseconds in a week
    const month = day * 30; // approximate milliseconds in a month
    const year=month*12;

    if (timeDifference < minute) {
        return 'just now';
    } else if (timeDifference < hour) {
        let a=Math.floor(timeDifference / minute) 
        if(a==1)return a + ' minute ago';
        else return  a + ' minutes ago';
    } else if (timeDifference < day) {
      let a=Math.floor(timeDifference / hour);
      if( a ==1)return a+ ' hour ago';
       else  return Math.floor(timeDifference / hour) + ' hours ago';
    } else if (timeDifference < week) {
      let a=Math.floor(timeDifference / day);
      if( a ==1)return a+ ' day ago';
       else  return Math.floor(timeDifference / day) + ' days ago';
    } else if (timeDifference < month) {
      let a=Math.floor(timeDifference / week);
      if( a ==1)return a+ ' week ago';
        else return Math.floor(timeDifference / week) + ' weeks ago';
    } else if(timeDifference<year) {
      let a=Math.floor(timeDifference / month);
      if( a ==1)return a+ ' month ago';
        return Math.floor(timeDifference / month) + ' months ago';
    }
    else{
      let a=Math.floor(timeDifference / year);
      if( a ==1)return a+ ' year ago';
      else return a+ ' years ago';
    }
}

const dateString = '2023-11-24T15:35:04Z';
const result = timeAgo(dateString);
console.log(result); // Output will be in the "ago" format

  
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
      <div class="video-info" onclick="openVideoDetails(
        '${video.id}','${thumbnailUrl}','${thisurl}',
        '${video.snippet.localized.title}',
        '${video.snippet.channelTitle}',
        '${video.statistics.viewCount}',
        '${video.snippet.channelId}')" >
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
              <p class="video-views">${video.statistics.viewCount}views. ${timeAgo(video.snippet.publishedAt)}</p>
              
            </div>
          </div>
        </div>
        `;
    }
  }
  
  function openVideoDetails(id,thumbnailUrl,channelimg,title,channeltitle,viewcount,channelId) {
    
    const videoDetails = [id,thumbnailUrl, channelimg, title,channeltitle,viewcount,channelId];

// Convert the array to a string and store it in localStorage
localStorage.setItem("videoDetails", JSON.stringify(videoDetails));
    
    const storedData = localStorage.getItem("videoDetails");

// Parse the string back to an array
const parsedData = JSON.parse(storedData);
    console.log(parsedData);
     window.open("./videoDetails.html");
  }

const searchinput=document.getElementById("search");
const search_btn=document.getElementById("searchicon"); 
let searchLink="https://www.youtube.com/results?search_query=";

search_btn.addEventListener('click',()=>{
  if(searchinput.value.length>0){
    location.href=searchLink+searchinput.value;
  }
})

getVideos("");