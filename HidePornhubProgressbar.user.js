// ==UserScript==
// @name         HidePornhubProgressbar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds a button to hide the progressbar on pornhub videos
// @author       HomeOfTrees
// @match        https://www.pornhub.com/view_video.php*
// @include      /https:\/\/(www\.)?(de\.)?pornhub\.com\/view_video\.php.*/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Prepare HidePornhubProgressbar');
    waitForPlayerLoad(5);


  function waitForPlayerLoad(repeat){
      let playerele = document.getElementById('player').getElementsByClassName('mhp1138_front')[0];
      if (playerele){
          insertHideProgressbarButtons(playerele);
      } else {
          if (repeat <= 0){
              console.log("HidePornhubProgressbar: player ele couldn't be found");
              return;
          } else {
              setTimeout(function(){
                  waitForPlayerLoad(repeat - 1);
              }, 2000);
          }
      }
  }

  function insertHideProgressbarButtons(playerele){
      console.log('HidePornhubProgressbar Script start')
      addSmoothStyle();
      littleStyleAdjustments();

      let hideprogressbtn = document.createElement('div');
      hideprogressbtn.id = 'hideprogressbtn1';
      hideprogressbtn.innerText = 'H';
      hideprogressbtn.addEventListener('click', function(){
          let progressbar = document.getElementsByClassName('mhp1138_seekBar')[0];
          let hidebtn = document.getElementById('hideprogressbtn1');
          let hidebtnstate = 0;
          if (hidebtn.classList.contains('hideprogressbtn-active-part')){hidebtnstate = 1;}
          if (hidebtn.classList.contains('hideprogressbtn-active-all')){hidebtnstate = 2;}
          switch(hidebtnstate){
              case 0: //activate part hide
                  progressbar.classList.add('hidepartprogress');
                  hidebtn.classList = 'hideprogressbtn-active-part';
                  break;
              case 1: //activate all hide
                  progressbar.classList.remove('hidepartprogress');
                  progressbar.classList.add('hideallprogress');
                  document.getElementsByClassName('mhp1138_time')[0].classList.add('hidetime');
                  hidebtn.classList = 'hideprogressbtn-active-all';
                  break;
              case 2: //reset to normal
                  progressbar.classList.remove('hideallprogress');
                  document.getElementsByClassName('mhp1138_time')[0].classList.remove('hidetime');
                  hidebtn.classList = '';
                  break;
          }

      });
      playerele.insertBefore(hideprogressbtn , document.getElementsByClassName('mhp1138_sound')[0]);

      function littleStyleAdjustments(){
          //document.getElementById('main-container').style.paddingTop = '100px';
          //document.getElementsByClassName('video-wrapper')[0].style.marginBottom = '100px';

          let spanstyle = document.createElement('style');
          spanstyle.type = 'text/css';
          spanstyle.innerHTML = `
#main-container{
padding-top: 100px;
}
#video-wrapper{
margin-bottom: 100px;
}
#hd-rightColVideoPage.wide{
padding-top: 200px;
}
`;
          document.body.appendChild(spanstyle);
      }

      function addSmoothStyle(){
          let smoothstyle = document.createElement('style');
          smoothstyle.type = 'text/css';
          smoothstyle.innerHTML = `
#hideprogressbtn1{
    float: left;
    width: 20px;
    font-size: 1.6em;
    text-align: center;
    padding: 0 16px 0 12px;
    line-height: 36px;
}
.hideprogressbtn-active-part{
    color:green !important;
}
.hideprogressbtn-active-all{
    color:red;
}
.hidepartprogress .mhp1138_progress {
    background-color: transparent !important;
}
.hidepartprogress .mhp1138_hotspots {
    display:none;
}
.hideallprogress{
    display:none;
}
.hidetime{
    color:transparent;
    background-color:#26232378;;
}
`;
          document.body.appendChild(smoothstyle);
      }
  }
})();
