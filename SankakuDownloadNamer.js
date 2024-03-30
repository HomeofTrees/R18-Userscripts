// ==UserScript==
// @name        SankakuDLNamer
// @namespace   SankakuDLNamer
// @description adds download btn with automatic file naming to sankaku
// @match       http*://chan.sankakucomplex.com/*posts/*
// @match       http*://idol.sankakucomplex.com/*posts/*
// @match       http*://beta.sankakucomplex.com/*posts/*
// @run-at      document-end
// @version     1.1.2.2
// @grant       GM_download
// ==/UserScript==

/* README
 * -customize the script by changing the constants in the CONFIGURABLE section below
 * -the download dialog pops up with a delay (after downloading). If you want the dialog to appear immediately,
 *  go to your tampermonkeys settings under Downloads BETA and set "Download Mode" to "Browser API"
*/

(function() {
	'use strict';
    console.log("Userscript SankakuDLNamer: Start");

    if (document.readyState == 'loading') {
        document.addEventListener("DOMContentLoaded", sankakuDLnamerInit);
    } else {
        sankakuDLnamerInit();
    }
    console.log("Userscript SankakuDLNamer: End");

function sankakuDLnamerInit(){

/* CONFIGURABLE */
        const FILENAME_SIZE_LIMIT = 180; //leave some space for Pathname
        const TAG_SEPERATOR_CHAR = '+';
        const FILENAME_FORMAT = "%Xid %artists - %copyrights %characters";
        /* use the following for replacement: (default "%Xid %artists - %copyrights %characters")
        %artists - all artist names
        %copyrights - all copyright names
        %characters - all characters (sorted alphabetically)
        %Xcharacters - like %characters but remove copyright and duplicate character names
        %id - post ID
        %Xid - post ID with fixed length (10 characters)
        */
/* CONFIGURABLE END*/
        const tagsidebar = document.getElementById('tag-sidebar');
		if (tagsidebar == null) { return; }

		let cats = GetSidebarTags(tagsidebar);

		let fileName = GenerateFilename(cats, FILENAME_SIZE_LIMIT, TAG_SEPERATOR_CHAR, FILENAME_FORMAT);

		let details = SetUpDLDetails(fileName);

		var dl_me = function() {
			GM_download(details);
		}
        var name_to_clipboard = function(){
            navigator.clipboard.writeText(fileName);
        }

        let dl_button = document.createElement('button');
        dl_button.id = "sankakudl_download";
        dl_button.style = "display: block; cursor:pointer;";
        dl_button.innerText = "download";
        dl_button.onclick = dl_me;

        let dl_name_copy = document.createElement('button');
        dl_name_copy.id = "sankakudl_name_copy";
        dl_name_copy.style = "display: block; cursor:pointer;";
        dl_name_copy.innerText = "✂";
        dl_name_copy.onclick = name_to_clipboard;

        let sankakudlnamer_wrapper = document.createElement('div');
        sankakudlnamer_wrapper.id = "sankakdlnamer_wrapper";
        sankakudlnamer_wrapper.style = "display:flex;"

        document.getElementById("post-content").prepend(sankakudlnamer_wrapper);
        document.getElementById("sankakdlnamer_wrapper").append(dl_button);
        document.getElementById("sankakdlnamer_wrapper").append(dl_name_copy);
	}

	function GetSidebarTags(tagsidebar) {
		const tagGroups = tagsidebar.getElementsByTagName('li');

		let cats = {};
		for (let tagGroup of tagGroups) {
			const cat = tagGroup.className.trim();
			const anchs = tagGroup.getElementsByTagName('a');
			let tag = '';
			for (let anch of anchs) {
				if (anch.hasAttribute('id')) {
					tag = anch.innerText.replace(/\s/g, '_').trim();
				}
			}
			if (cat in cats) {
				if (tag != '') {
					cats.cat = cats[cat].push(tag);
				}
			} else {
				if (tag != '') {
					cats[cat] = [];
					cats[cat].push(tag);
				}
			}
		}

		return cats;
	}

    function getPostId() {
		const pathname = window.location.pathname;
		const temp = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname);
		return temp.substring(temp.lastIndexOf('/') + 1);
    }

	function GenerateFilename(cats, FILENAME_SIZE_LIMIT, SEP, FILENAME_FORMAT) {
		let artists = cats['tag-type-artist'] ? cats['tag-type-artist'].join(SEP) : '';
        let copyrights = cats['tag-type-copyright'] ? cats['tag-type-copyright'].join(SEP) : '';
        let characters = '';
        let xcharacters = '';

        if (cats['tag-type-character']){
            characters = [...cats['tag-type-character']].sort().join(SEP)
            //remove copyright in every string e.g. ["sakura_(street_fighter)"] -> ["sakura"]
            xcharacters = cats['tag-type-character'].map((s) => {return s.replace(/([^ ])_?\([^)]*\) *$/g, '$1')});
            xcharacters = [...new Set(xcharacters)].join(SEP); //remove duplicates
        }

        let id = getPostId();

        let filename = FILENAME_FORMAT;
        filename = filename.replaceAll('%artists', artists);
        filename = filename.replaceAll('%copyrights', copyrights);
        filename = filename.replaceAll('%characters', characters);
        filename = filename.replaceAll('%Xcharacters', xcharacters);
        filename = filename.replaceAll('%id', id);
        filename = filename.replaceAll('%Xid', String(id).padStart(10, '0'));

        if (filename.length > FILENAME_SIZE_LIMIT) {
            //TODO create a smart function that shortens the name while preserves whole tags (or additionally fills up free space with general tags)
            filename = filename.substring(0, FILENAME_SIZE_LIMIT - 1) + "#";
        }

        filename = filename.replaceAll(/[/\\?%*:|"<>]/g, '-');

        return filename;
	}


	function SetUpDLDetails(fileName) {
		const stat = document.getElementById('stats');
		let url = 'https:' + stat.querySelectorAll('#highres')[0].getAttribute("href").trim();
		let extension = url.split('?')[0].split('.');
		extension = extension[extension.length - 1];
		let details = {
			'url': url
			, 'name': fileName + '.' + extension
			, 'saveAs': true
		}

		return details;
	}
})();
