// ==UserScript==
// @name         uflashBypassAntiAdblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  circumvents the annoying and false positive adblock detection of uflash
// @author       Me
// @match        http://www.uflash.tv/video/*
// @icon         http://www.uflash.tv/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @run-at       document-idle
// ==/UserScript==
//// @run-at document-start

/*
-- Small Explanation --
The adblock detection is just two inline <script> tags. One just sets a variable _8xHp9vZ2 that contains the link to the video (base64),
the other one checks whether the ads tags exist on the page, if it is satisfied it creates the <video> tag, otherwise it overwrites the _8xHp9vZ2 variable.
Also second script is obfuscated, everything is written in hex numbers and uses some tricks to confuse you. Like
_0x16f5xe = !![];
where !![] just means true or using an array to store index numbers and function names
_0x16f5x2[_0x5804[15]](_0x16f5x2[_0x5804[14]]())
which translates to
mylist.push(mylist.shift)

There are basically 2 ways to circumvent the AdblockDetection
1. overwrite the script tag before it is executed (This requires @run-at document-start and instant script injection to work)
2. create the video tag after adblock detection deemed you unworthy

This script uses the second approach

*/

(function() {
    'use strict';
    console.log("run 'uflashBypassAntiAdblock' Script...");

    /*
    if (document.head) {
        throw new Error('Head already exists - make sure to enable instant script injection');
    }
    */

    let _8xrex = /var\s*_8xHp9vZ2\s*=\s*\\?"([a-zA-Z0-9]*?)\\?"\s*;/;

    //find definition of _8xHp9vZ2 in a <script> tag
    let scriptVidLink = $("#ad300x250 script").text();
    if (!scriptVidLink){
        let c8 = $('script:contains("_8xHp9vZ2")');
        c8.each( (i,e) => { let xx = e.textContent.match(_8xrex); if (xx) { scriptVidLink = xx[1]; } } );
    } else {
        scriptVidLink = scriptVidLink.match(_8xrex)[1];
    }

    if (!scriptVidLink) {
        throw new Error('Failed to extract "_8xHp9vZ2" from <script> tags');
    }
    //base64 decode
    scriptVidLink = atob(scriptVidLink);

    //create Video tag with previously extracted link
    $("#flash").prepend(`<video controls id="videoplayer" src="${scriptVidLink}" style="background-color:#2b2b2b;max-height: 80vh;max-width: 90vh; width:100%; height:100%;"></video>`);


})();
