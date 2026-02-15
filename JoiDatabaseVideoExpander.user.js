// ==UserScript==
// @name         joi-database-video-expander
// @namespace    http://tampermonkey.net/
// @version      2026-02-15
// @description  adds button to expan video frame
// @author       HomeOfTrees
// @match        https://www.the-joi-database.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=the-joi-database.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

let expander = document.createElement('div')
expander.textContent = "⇉⇉⇉"
expander.style = `
writing-mode: vertical-rl;
text-orientation: upright;
color: #6f4f8c;
margin-left: -20px;
margin-right: -20px;
cursor: pointer;
`

var nstyle_id = 'videoframe-expander-css'

var nstyle1 = `
.content .col-lg-8{
   max-width: none;
   flex: 1 0 64%
}
.content .col-lg{
   opacity: 35%;
}`
var nstyle2 = `
.content .col-lg-8{
   max-width: 89%;
   flex: 1 0 auto;
}
.content .col-lg{
   display: none;
}`

expander.addEventListener("click", (event) => {
	let nstyle = document.createElement('style');
	nstyle.id = nstyle_id;
	nstyle.type = 'text/css';

	let oldnstyle = document.getElementById(nstyle_id);
	if (oldnstyle){
		let version = oldnstyle.getAttribute('nstyle-version');
		if (version == 1){
            oldnstyle.remove();
			nstyle.setAttribute("nstyle-version","2");
			nstyle.innerHTML = nstyle2;
			document.body.append(nstyle);

		} else {
			oldnstyle.remove();
		}
	} else {
		nstyle.setAttribute("nstyle-version","1");
		nstyle.innerHTML = nstyle1;
		document.body.append(nstyle);
	}

 })


document.querySelector(".content .col-lg-8").after(expander)
})();
