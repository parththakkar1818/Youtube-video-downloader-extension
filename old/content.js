chrome.action.onClicked.addListener(async (tab) => {
  const videoUrl = extractVideoUrl(tab.url);
  if (videoUrl) {
    downloadVideo(videoUrl);
  } else {
    console.error("No video found on this page");
  }
});

function extractVideoUrl(url) {
  // Logic to extract the video ID from the YouTube URL
  // Example: https://www.youtube.com/watch?v=UxxajLWwzqY
  const match = url.match(/(?:\?|&)v=([^&]+)/);
  return match ? match[1] : null;
}

async function downloadVideo(videoId) {
  const options = {
    method: "GET",
    url: "https://youtube-mp36.p.rapidapi.com/dl",
    params: { id: videoId },
    headers: {
      "X-RapidAPI-Key": process.env,RAPIDAPI_KEY,
      "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(options.url + "?id=" + videoId, {
      method: "GET",
      headers: options.headers,
    });
    const data = await response.json();
    if (data.link) {
      chrome.downloads.download({
        url: data.link,
        filename: data.title + ".mp3",
      });
    } else {
      console.error("Failed to get download link");
    }
  } catch (error) {
    console.error(error);
  }
}
