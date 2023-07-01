const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyCx-Xi2daaOrPmQl9Y8inmmDvmfbvsjUY8";

const container = document.getElementById("videos-container");


async function getVideos(q) {
    const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&type=videos&maxResults=20`;
    const response = await fetch(url, {
      method: "get",
    });
    const data = await response.json();
   // console.log(data);
     const videos = data.items;
     getVideoData(videos);
  }
  
  async function getVideoData(videos) {
    let videoData = [];
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const videoId = video.id.videoId;
      videoData.push(await getVideoDetails(videoId));
    }
  
    console.log(videoData);
    renderVideos(videoData);
  }
  
  async function getVideoDetails(videoId) {
    const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
    const response = await fetch(url, {
      method: "get",
    });
    const data = await response.json();
    return data.items[0];
  }
  
  function renderVideos(videos) {
    container.innerHTML = ``;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const thumbnailUrl = video.snippet.thumbnails.high.url;
      container.innerHTML += `
      <div class="video-info" onclick="openVideoDetails('${video.id}')" >
          <div class="video-image">
            <img src="${thumbnailUrl}" alt="video thumbnail" />
          </div>
          <div class="video-description">
            <div class="channel-avatar">
              <img src="" alt="channel avatar" />
            </div>
            <div class="video-title">${video.snippet.localized.title}</div>
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