// ==UserScript==
// @name         LFG Light (for Bungie's Destiny 2)
// @namespace    https://github.com/mariusffs/lfg-light
// @version      0.91
// @description  A compact redesign of Bungie's LFG Fireteam site for laptop screens. Some UX improvements and added features: Reduced use of dropdowns, more 1-click scenarios, remove unnecessary UI, add links to raid.report and dungeon.report (Stadia users not supported, some issues with multi-platform accounts for PC). Add page reloader for 10s interval until disabled or tab is closed. 
// @author       mariusffs
// @run-at       document-start
// @include      https://www.bungie.net/en/ClanV2/PublicFireteam*
// @include      https://www.bungie.net/en/ClanV2/FireteamSearch*
// @grant        none
// ==/UserScript==

function removeFlash() {
	const removeCssFlash = `
		<style>
			body {
				opacity: 0;
			}
		</style>
	`;
	document.querySelector('head').innerHTML += removeCssFlash;
}

function mainScript() {
	document.addEventListener("DOMContentLoaded", function() {
		
		// Add Custom CSS styling
		const customCSS = `
		<style>
			/* General / increase vertical space */

			footer.footer,
			header,
			.topiclisting_promo,
			.promo,
			.promo ~ form > .fireteamBox,
			.promo ~ form > .fireteamBox #fireteam-form .options-container > div:nth-of-type(2),
			.fireteam-join-modal .fireteam-warning,
			.nav-kit.basic-sub-nav a.current:after,
			.nav-kit.basic-sub-nav a:hover:after { 
				display: none;
			}
			.search .container_bodyContent {
				margin-top: 0;
				height: 100vh !important;
			}
			.nav-kit.basic-sub-nav a.current { color: #ebbf24; }
			.header-container .basic-sub-nav-Fireteams { padding: 0; }


			/* Two column system */

			.item-fireteam .item-fireteam-card .fireteam-content .title {
				font-size: .8rem;
				margin-bottom: 7px;
			}
			.item-fireteam .item-fireteam-card .fireteam-meta p.meta {
				color: #9da9b9;
				font-size: 8px;
			}
			.item-fireteam .item-fireteam-card .fireteam-meta p.owner.meta {
				overflow: hidden;
				width: 10px;
				height: 16px;
			}
			.item-fireteam .item-fireteam-card .fireteam-content .player-slots .player-slot {
				width: 15px;
				height: 15px;
				margin-right: 4px;
			}
			.react-gridmax .activity-icon {
				min-width: 37px;
				height: 35px;
			}
			li.item-fireteam {
				width: 50%;
			}
			li.item-fireteam:nth-child(odd) {
				border-right: 1px solid #2d3440;
			}
			.item-fireteam:last-child .item-fireteam-card {
				border-bottom: 1px solid #2d3440;
			}
			.results-search-fireteams {
				border-radius: 0;
			}
			.item-fireteam .item-fireteam-card:hover {
				background: rgba(33,40,51,1);
				box-shadow: 0 0 2px rgba(0,0,0,0.75) inset;
				color: #ebbf24;
			}
			.results-search-fireteams {
				box-shadow: 0 0 3px rgba(0,0,0,0.15);
			}
			

			/* Fireteam list */

			.FireteamSearch .container_bodyContent .header .header-container {
				margin-bottom: 2px;
				border-radius: 0;
				box-shadow: 0 0 3px rgba(0,0,0,0.15);
			}
			.fireteam-content .badge-container {
				display: none;
			}
			.FireteamSearch .options-container {
				border-radius: 0px;
				margin-bottom: 2px;
				border-bottom: 0;
			}
			.promo ~ form > .fireteamBox #fireteam-form .options-container > div:last-child {
				margin-right: 0;
			}
			.promo ~ form > .fireteamBox.visible {
				display: flex;
			}
			.lfg-pandl-settings {
				cursor: pointer;
				color:rgba(245,245,245,0.5);
				margin-left: 25px;
			}
			.lfg-pandl-settings:hover {
				color: #fff;
			}
			.lfglight-login-button {
				margin-left: 10px;
			}


			/* Guardian List */

			.activity-header { 
				height: 140px;
				position: relative;
			}
			.activity-header.more-height { 
				height: 200px;
			}
			.activity-header .badge-container,
			.js-open-report-fireteam,
			.clanBreadcrumb { 
				display: none !important;
			}
			.activity-header .activity-icon {
				margin-left:0;
				flex: none;
				position: absolute;
				right: 10px;
				top: 30px;
				height: 80px;
				width: 80px;
			}
			.activity-header .fireteam-actions .button {
				margin-top: 15px;
			}
			.activity-header .section-header {
				margin: 0 0 0 0 !important;
				padding: 0 0 0 0 !important;
				font-size: 1.6em;
			}
			a.link-raid-report {
				color: #ebbf24;
				margin-left: 10px;
				font-weight: 600;
				opacity: .8;
			}
			a.link-raid-report:hover {
				color: #ebbf24;
				opacity: 1;
			}
			p.explanation {
				line-height: 1.2;
				color: rgba(255,255,255,0.6);
				font-size: 11px;
			}
			

			/* SIDE MENU */
			.side-menu {
				background-color: #181d21;
				margin: 0;
				padding: 0;
				font-size: 14px;
				height: 100vh;
				box-sizing: border-box;
				width: 260px;
				float: left;
				box-shadow: 0 0 3px rgba(0,0,0,.4);
				overflow-y: auto;
			}
			.side-menu .top {
				width: 100%;
				min-height: 99px;
				background: url(https://www.bungie.net/7/ca/destiny/bgs/new_light/hero_bg_desktop.jpg) #181d21 no-repeat;
				background-size: contain;
			}
			.side-menu .content-wrap { 
				padding: 1.25em;
				background-color: #181d21;
				margin-top: -15px;
				border-top: 1px solid rgba(255, 255, 255, .1);
				position: relative;
			}
			.side-menu h1 {
				color: #fff;
				font-size: 1em;
				text-align: center;
				padding-top: 55px;
				text-shadow: 1px 1px 1px rgba(0,0,0,.75);
				letter-spacing: 0.25em;
				text-transform: uppercase;;
			}
			.side-menu h2 {
				color: #fff;
				font-size: 0.75em;
				font-weight: 600;
				margin: 0;
				text-transform: ;
			}
			.side-menu ul {
				margin-top: .5em;
				margin-bottom: 1em;
				margin-left: 0;
				padding-left: .5em;
			}
			.side-menu li {
				list-style: none;
				font-size: 1em;
				line-height: 1.5;
				margin-left: 0;
				padding-left: 0;
				opacity: .6;
				color: #fff;
			}
			.side-menu li:hover { 
				opacity: 1;
			}
			.side-menu li::before {
				content: ' ';
				display: inline-block;
				height: 0.75em;
				width: 1em;
				background-size: contain;
				background-repeat: no-repeat;
				margin-right: .25em;
			}	
			.side-menu li.event-dsc::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_DeepStoneCrypt.png); }
			.side-menu li.event-garden::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_GardenOfSalvation.png); }
			.side-menu li.event-lastwish::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_LastWish.png); }
			.side-menu li.event-nightfall::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireTeamStrike.png); }
			.side-menu li.event-wrathbornhunts::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_Lure.png); }
			.side-menu li.event-exochallenge::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_SimulationChallenge.png); }
			.side-menu li.event-empirehunts::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_icons_empirehunts.png); }
			.side-menu li.event-dungeons::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamDungeon.png); }
			.side-menu li.event-altars::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamAltarsOfSorrow.png); }
			.side-menu li.event-blindwell::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamBlindWell.png); }
			.side-menu li.event-nightmarehunts::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamNightmareHunts.png); }
			.side-menu li.event-trials::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamTrialsOfOsiris.png); }
			.side-menu li.event-crucible::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamCrucible.png); }
			.side-menu li.event-anything::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamAnything.png); }
			.side-menu li.event-gambit::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteamGambit.png); }
			.side-menu li.event-exotic::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_icons_exoticquests.png); }
			.side-menu li.event-battlegrounds::before { background-image: url(https://www.bungie.net/img/theme/destiny/icons/fireteams/fireteam_icons_battlegrounds.png); }
			.side-menu a { 
				text-decoration: none;
				color: inherit;
			}
			.side-menu li a span.season-tag {
				color: #81ca88;
				font-size: .6em;
				vertical-align: super;
			}
			.side-menu li.active { 
				color: #ebbf24;
				opacity: 1;
			}
			.side-menu .container_bodyContent {
				width: calc(100vw - 260px);
				float: right;
			}
			.side-menu #refresher {
				position: absolute;
				top: 10px;
				right: 10px;
				font-size: 1.2em;
				background: none;
				border: none;
				opacity: .6;
				color: #fff;
				cursor: pointer;
				text-shadow: 0 0 1px rgba(0,0,0,0.75);
				transition: all .5s ease-in-out;
			}
			.side-menu #refresher:hover,
			.side-menu #refresher.active:hover { 
				opacity: 1;
				transform: scale(1.2);
			}
			.side-menu #refresher:focus { outline: none; }
			.side-menu #refresher.active {
				opacity: .8;
				color: #ebbf24;
				-webkit-animation: rotating 3s linear infinite !important;
				-moz-animation: rotating 3s linear infinite !important;
				-ms-animation: rotating 3s linear infinite !important;
				-o-animation: rotating 3s linear infinite !important;
				animation: rotating 3s linear infinite !important;
			}
			@-webkit-keyframes rotating /* Safari and Chrome */ {
				from {
					-webkit-transform: rotate(0deg);
					-o-transform: rotate(0deg);
					transform: rotate(0deg);
					}
				to {
					-webkit-transform: rotate(360deg);
					-o-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			@keyframes rotating {
				from {
					-ms-transform: rotate(0deg);
					-moz-transform: rotate(0deg);
					-webkit-transform: rotate(0deg);
					-o-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				to {
					-ms-transform: rotate(360deg);
					-moz-transform: rotate(360deg);
					-webkit-transform: rotate(360deg);
					-o-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			.side-menu .kofi-wrapper {
				border: 0;
				display: block;
				text-align: center;
				margin-top: -5px;
			}
			.side-menu .kofi-wrapper img {
				width: 40%;
			}
			/* Join menu character select: Remove artifical select element trigger */
			.react-mobile .fireteam-join-modal .form-kit.dropdown-item .select-box,
			.modal .fireteam-join-modal .form-kit.dropdown-item .select-box {
				display: none;
			}
			/* Join menu character select: Show all characters */
			.modal .fireteam-join-modal .form-kit.dropdown-item select {
				position: relative;
				opacity: 1;
				overflow: hidden;
				width: calc(100% + 5px);
			}
			/* Join menu character select: Pretty padding */
			.fireteam-join-modal .form-kit.dropdown-item select option {
				padding: 1rem;
			}
			/* Fade in body to prevent flash */
			@keyframes fadeInOpacity {
				0% {
					opacity: 0;
				}
				100% {
					opacity: 1;
				}
			}
			body {
				opacity: 1;
				animation-name: fadeInOpacity;
				animation-iteration-count: 1;
				animation-timing-function: ease-in;
				animation-duration: .25s;			
			}
			/* Slim down Create Fireteam menu if you are have English and Playstation as your settings */
			.playstation #modal-create-fireteam .modal .checkbox-container,
			.playstation #modal-create-fireteam .modal h6.section-header:nth-of-type(n+3),
			.playstation #modal-create-fireteam .modal .dropdown-item-lang-selector-create,
			.playstation #modal-create-fireteam .modal .options-container .option:nth-of-type(1) {
				display: none;
			}
			.playstation #modal-create-fireteam .modal h6.section-header,
			.playstation #modal-create-fireteam .modal .character-selector-label { 
				margin-bottom: 10px;
				font-size: .75rem;
				display: block;
			}
			/* Hide legacy content */
			.event-nightmarehunts,
			.event-blindwell,
			.event-altars {
				display: none;
			}
		</style>
		`;
		document.querySelector('head').innerHTML += customCSS;

		// Define pages and get URL params
		const isFireteamList = window.location.href.indexOf("FireteamSearch") > -1;
		const isGuardianList = window.location.href.indexOf("PublicFireteam") > -1;
		const urlParams = new URLSearchParams(window.location.search);

		// Look up and define current platform
		var bungieLocalStorage = JSON.parse(localStorage.getItem("fireteamOptions"));
		var platform;
		if (bungieLocalStorage !== null) {
			switch (bungieLocalStorage.allView.fireteamPlat) {
				case '1':
					platform = "ps";
					break;
				case '2':
					platform = "xb";
					break;
				case '4':
					platform = "pc";
					break;
			}
		}

		// Add navigation
		function createMenu() {
			var sideMenu = document.createElement('div');
			sideMenu.setAttribute('class', 'side-menu');
			sideMenu.innerHTML = `
				<div class="top">
					<h1>LFG Light</h1>
				</div>
				<div class="content-wrap">
					<h2>Raids</h2>
					<ul>
						<li class="event-dsc"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=22">Deep Stone Crypt</a></li>
						<li class="event-garden"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=21">Garden of Salvation</a></li>
						<li class="event-lastwish"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=20">Last Wish</a></li>
					</ul>
					<h2>PVE</h2>
					<ul>
						<li class="event-nightfall"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=4">Nightfall</a></li>
						<li class="event-exotic"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=27">Exotic Quests</li>
						<li class="event-battlegrounds"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=26">Battlegrounds <span class="season-tag">(S13)</span></a></li>
						<li class="event-wrathbornhunts"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=24">Wrathborn Hunts <span class="season-tag">(S12)</span></a></li>
						<li class="event-exochallenge"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=23">Exo Challenge</a></li>
						<li class="event-empirehunts"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=25">Empire Hunts</a></li>
						<li class="event-dungeons"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=15">Dungeons</a></li>
						<li class="event-altars"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=14">Altars of Sorrow</a></li>
						<li class="event-blindwell"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=7">Blind Well</a></li>
						<li class="event-nightmarehunts"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=12">Nightmare Hunts</a></li>
					</ul>
					<h2>PVP</h2>
					<ul>
						<li class="event-trials"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=3">Trials of Osiris</a></li>
						<li class="event-crucible"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=2">Crucible</a></li>
					</ul>
					<h2>Other</h2>
					<ul>
						<li class="event-gambit"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=6">Gambit</a></li>
						<li class="event-anything"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=5">Anything</a></li>
						<li class="event-all"><a href="https://www.bungie.net/en/ClanV2/FireteamSearch?activityType=0">All</a></li>
					</ul>
					<i id="refresher" class="material-icons" title="Toggle a 10s refresh timer">cached</i>
					<a href='https://ko-fi.com/P5P13CHH5' target='_blank' class="kofi-wrapper"><img src='https://cdn.ko-fi.com/cdn/kofi2.png?v=2' alt='Buy Me a Coffee at ko-fi.com' /></a>
				</div>
			`;
			document.getElementsByClassName('container_bodyContent')[0].parentNode.prepend(sideMenu);
		}
		createMenu();


		// ** FIRETEAM LIST SPECIFICS

		// Add login button if not logged in
		function addLoginButton() {
			if(document.querySelector(".btn_openCreateFireteam").classList.contains("disabled")) {
				var loginButton = document.createElement('a');
				Object.assign(loginButton, {
					href: "/en/User/SignIn/Psnid?flowStart=1",
					className: "lfglight-login-button button small",
					innerHTML: "Login",
				});
				document.querySelector(".create-fireteam").appendChild(loginButton);
			}			
		}

		// Toggle Platform and Language via settings icon
		function toggleSettings() {
			var settingsPanel = document.querySelector(".fireteamBox");
			if (settingsPanel.classList.contains("visible")) {
				settingsPanel.classList.remove("visible");
				location.reload(); // hack to make sure changes apply when swapping language / platform
			} else {
				settingsPanel.classList.add("visible");
			}
		}		

		// Add a settings icon for the above toggle
		function addSettings() {
			const settingsParent = document.querySelector("div.sub-nav-items");
			const settingsIcon = document.createElement("i");
			Object.assign(settingsIcon, {
				className: "material-icons lfg-pandl-settings",
				innerHTML: "settings",
				title: "Toggle Platform and Language settings",
			});
			settingsParent.appendChild(settingsIcon);
			settingsIcon.addEventListener("click", toggleSettings);
		}

		// Add menu highlights
		function highlightMenu() {
			switch (currentActivity) {
				case '0':
					document.querySelector(".event-all").classList.add("active");
					break;
				case '22':
					document.querySelector(".event-dsc").classList.add("active");
					break;
				case '21':
					document.querySelector(".event-garden").classList.add("active");
					break;
				case '20':
					document.querySelector(".event-lastwish").classList.add("active");
					break;
				case '4':
					document.querySelector(".event-nightfall").classList.add("active");
					break;
				case '27':
					document.querySelector(".event-exotic").classList.add("active");
					break;
				case '26':
					document.querySelector(".event-battlegrounds").classList.add("active");
					break;
				case '24':
					document.querySelector(".event-wrathbornhunts").classList.add("active");
					break;
				case '23':
					document.querySelector(".event-exochallenge").classList.add("active");
					break;
				case '25':
					document.querySelector(".event-empirehunts").classList.add("active");
					break;
				case '15':
					document.querySelector(".event-dungeons").classList.add("active");
					break;
				case '14':
					document.querySelector(".event-altars").classList.add("active");
					break;
				case '7':
					document.querySelector(".event-blindwell").classList.add("active");
					break;
				case '12':
					document.querySelector(".event-nightmarehunts").classList.add("active");
					break;
				case '3':
					document.querySelector(".event-trials").classList.add("active");
					break;
				case '2':
					document.querySelector(".event-crucible").classList.add("active");
					break;
				case '6':
					document.querySelector(".event-gambit").classList.add("active");
					break;
				case '5':
					document.querySelector(".event-anything").classList.add("active");
					break;
			}
		}

		// Slim down Create Fireteam modal for English Playstation users
		function slimCreateFireteamMenu() {
			if (platform == "ps" && bungieLocalStorage.allView.fireteamLang == "en") {
				document.querySelector("body").classList.add("playstation");
			}
		}

		if (isFireteamList) {
			var currentActivity = urlParams.get("activityType");
			localStorage.setItem('lfgActivity', currentActivity);
			addLoginButton();
			addSettings();
			highlightMenu();
			slimCreateFireteamMenu();
		}


		// ** GUARDIAN LIST SPECIFICS

		// Fireteam join modal select box: Change from dropdown to list, show all characters, enabling 1 click selection
		function showAllCharacters() {
			window.pollForSelect = setInterval(function () {
				var charSelect = document.querySelector("div.fireteam-join-modal select.js-select-box");
				if (charSelect !== null) {
					charSelect.setAttribute("size","3");
					clearInterval(window.pollForSelect);
				}
			}, 50);
		}
		
		// Add links to look up guardians in fireteam on raid.report or dungeon.report
		function addReportLinks() {
			var reportType = (currentActivity == "15") ? "https://dungeon.report/" : "https://raid.report/";
			var reportTypeName = (currentActivity == "15") ? "Dungeon Report" : "Raid Report";
			var platformId;
			if (platform !== undefined) { 
				window.pollForUsers = setInterval(function () {
					if (document.querySelector("a.display-name") !== null) {
						var links = document.querySelectorAll("a.display-name");
						for (var i=0, n=links.length;i<n;i++) {
							if (platform == "pc") {
								platformId = links[i].href.substring(links[i].href.lastIndexOf("/")+1);
							} else {
								platformId = links[i].innerHTML;
							}
							var reportLink = document.createElement('a');
							Object.assign(reportLink, {
								href: reportType + platform + "/" + platformId,
								className: "link-raid-report",
								innerHTML: "[" + reportTypeName + "]",
								target: "_blank",
							});
							links[i].parentNode.appendChild(reportLink);
						}
						clearInterval(window.pollForUsers);
					}
				}, 50);
			}
		}

		if (isGuardianList) {
			var currentActivity = localStorage.getItem('lfgActivity');

			showAllCharacters();
			addReportLinks();

			// Poll to see if user pieces of the script is missing (removed by leaving a fireteam and cancelling joining)
			window.pollMissing = setInterval(function () {
				if (document.querySelector("div.side-menu") == null) {
					createMenu();
					addReportLinks();
				}
				if (document.querySelector(".character-selector-label ~ div > .js-select-box").getAttribute("size") !=="3") {
					showAllCharacters();
				}
			}, 500);
			
			// Toggle size of header regarding joined or not to fit extra info bar
			if (document.querySelector("p.explanation") !== null) {
				document.querySelector(".activity-header").classList.add("more-height");
			}
		}


		// ** Page Reloader specifics

		var reloaderActive = JSON.parse(sessionStorage.getItem('lfgReloadState')) ? true : false;

		const toggleButton = document.querySelector("#refresher");
		const bodyContent = document.querySelector(".container_bodyContent");

		// Add or Remove UI elements + functionality if reloader is active
		function applyReloaderChanges() {
			if (reloaderActive) {
				toggleButton.classList.add("active");
				bodyContent.addEventListener("mouseup",toggleReloaderState);
				window.PageReloader = setInterval(function () {
					location.reload();
				}, 10000);
			} else if (!reloaderActive && toggleButton.classList.contains("active")) {
				clearInterval(window.PageReloader);
				toggleButton.classList.remove("active");
				bodyContent.removeEventListener("mouseup",toggleReloaderState);
			}
		}
		applyReloaderChanges();

		// Toggle current Reloader state and reload immediately if Reloader is activated
		function toggleReloaderState() {
			reloaderActive = !reloaderActive;
			sessionStorage.setItem('lfgReloadState',reloaderActive);
			applyReloaderChanges();
			if (reloaderActive) {
				location.reload();
			}
		}

		toggleButton.addEventListener("click",toggleReloaderState);
	});
}

const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

if (!isChrome || window.innerWidth < 1024) {
	alert("LFG Light: Is only supported on Google Chrome with viewports larger than 1023px");
} else {
	removeFlash();
	mainScript();
}
