// Handles loading the events for <model-viewer>'s slotted progress bar
//add neg and pos var

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};


function onClick() {
    var clicks = 0
    var clickCounter = 0
    if(sessionStorage.getItem("clickCount") == null){
      clickCounter = sessionStorage.setItem("clickCount", 0);
    }
    else if(sessionStorage.getItem("clickCount") >= 10)
    {
      clickCounter = sessionStorage.setItem("clickCount", 0);
      //add ending of game
    }
    else
    {
      clicks = parseInt(sessionStorage.getItem("clickCount")); ;
    }
    clicks++; 
    clickCounter = sessionStorage.setItem("clickCount", clicks);
    document.getElementById("clicks").innerHTML = clicks;
    alert(clickCounter);
};





