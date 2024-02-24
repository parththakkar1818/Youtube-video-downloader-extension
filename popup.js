document.addEventListener("DOMContentLoaded", async function () {
  const downloadButton = document.getElementById("downloadBtn");
  const loadingDiv = document.getElementById("loading");

  downloadButton.addEventListener("click", async function () {
    loadingDiv.innerHTML = '<div class="loading"></div>';
    // Get the current tab's URL
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const url = tabs[0].url;
        // Extract video ID from the URL
        const videoIdIndex = url.indexOf("v=");
        if (videoIdIndex === -1) {
          alert("Could not find video ID in the URL.");
          return;
        }
        const videoId = url.slice(videoIdIndex + 2, videoIdIndex + 13); // Assuming video ID is 11 characters long

        const apiKey = "705f5165e0msh5556e8f0470e3cdp165892jsna699bd4288e1";
        const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
            },
          });
          const data = await response.json();
          console.log(data);
          if (data.link) {
            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = data.link;
            a.download = `video_${videoId}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            alert("Failed to fetch download link. Please try again later.");
            loadingDiv.innerHTML = "";
          }
        } catch (error) {
          console.error(error);
          alert("An error occurred. Please try again later.");
          loadingDiv.innerHTML = "";
        } finally {
          loadingDiv.innerHTML = "";
        }
      }
    );
  });
});
