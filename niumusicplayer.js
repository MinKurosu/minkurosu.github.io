// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// Creates an element for the second iframe (used to get the title of the next track)
var infotag = document.createElement('div')
infotag.id = "playerinfo"
infotag.style.display = "none"
document.getElementById('player').parentNode.appendChild(infotag)
document.getElementById('player').style.display = "none"
//    This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var playlist = document.getElementById("player").getAttribute("playlist")
var shuffle = document.getElementById("player").getAttribute("shuffle")
var autoplay = document.getElementById("player").getAttribute("autoplay")
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          playerVars: {
            'playsinline': 1,
            listType: 'playlist',
            list: playlist,
            loop: 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

var playerinfoframe
// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    if (shuffle) {
        player.setShuffle(true)
    }
    if (autoplay) {
        event.target.playVideo();
    }
    var playlist = player.getPlaylist()
    var index = player.getPlaylistIndex()
    var currentvid = playlist[index]
    playerinfoframe = new YT.Player('playerinfo', {
    height: '390',
    width: '640',
    videoId: currentvid,
    playerVars: {
        mute: 1,
    },
    events: {
        'onStateChange': updateInfo
    }
    });
    document.getElementById("player4").innerHTML = "Now playing:"+document.getElementById("playerinfo").title
}

//   The API calls this function when the player's state changes.
var done = false;
var url
function onPlayerStateChange(event) {
  if (event.data == 1) {
      var playlist = player.getPlaylist()
      var index = player.getPlaylistIndex()
      var currentvid = playlist[index+1]
      url = player.getVideoUrl()
      playerinfoframe.loadVideoById(currentvid)
      document.getElementById("nowplaying").innerHTML = "Now playing:"+'<a href="'+url+'">'+document.getElementById("player").title+"</a>"
      }
}
// pause and play function
function pauseplay() {
  if(player.getPlayerState() == 1) {
      player.pauseVideo();
    }
    else {
      player.playVideo();
    }
}
// update next track
function updateInfo() {
  document.getElementById("nextup").innerHTML = 'Next up: <a href="'+playerinfoframe.getVideoUrl()+'">'+document.getElementById("playerinfo").title+"</a>"
}
