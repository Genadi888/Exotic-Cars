import { html } from "../lib/lit-html.js";

export const layoutTemplate = (topShadowRoot, onLogout, user, collapseClickHandler, navProfileToolsObj) => html`
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link rel="stylesheet" href="/css/navbar-and-footer.css">
	
	<div @click=${collapseClickHandler} id="drop-down-menu-container">
		<ul class="navbar-nav">
			${user ? html`
				<li class="nav-item">
					<a class="nav-link" href="/share-photos">SHARE YOUR CAR PHOTOS!</a>
				</li>
			` : null}
			<li class="nav-item">
				<a class="nav-link" href="/about-us">ABOUT US</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/showrooms">SHOWROOMS</a>
			</li>
			${user ? html`
				<li>
					<a class="nav-link" href="/edit-profile">EDIT PROFILE</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" @click=${onLogout} href="javascript:void(0)">LOG OUT</a>
				</li>
			` : html`
				<li class="nav-item">
					<a class="nav-link" href="/login">LOG IN</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/register">REGISTER</a>
				</li>
			`}
		</ul>
	</div>
	<nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a @click=${collapseClickHandler} href="/">
				<img width="50px" height="50px" src="/images/site-logo.png" alt="sports car">
			</a>
			<a @click=${collapseClickHandler} class="navbar-brand" href="/">Exotic Cars</a>
			<button @click=${collapseClickHandler} id="collapse-button"
				class="navbar-toggler" type="button"
				data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
	
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav" id="inline-navbar-nav">
					${user ? html`
						<li class="nav-item">
							<a class="nav-link" href="/share-photos">SHARE YOUR CAR PHOTOS!</a>
						</li>
					`: null}
					<li class="nav-item">
						<a class="nav-link" href="/about-us">ABOUT US</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/showrooms">SHOWROOMS</a>
					</li>
					
					<li class="nav-item profile-tools-and-pic">
						<a id="profile-image-link" href="${user ? '/edit-profile' : ''}" @mouseover=${navProfileToolsObj.pictureMouseOverHandler} @mouseleave=${navProfileToolsObj.pictureMouseLeaveHandler} title="Click to view options">
							<img src="/images/user-pic.webp" alt="profile-pic" class="profile-pic">
						</a>
						<ul @click=${navProfileToolsObj.profileToolsMouseClickHandler} @mouseleave=${navProfileToolsObj.profileToolsMouseLeaveHandler} @mouseenter=${navProfileToolsObj.profileToolsMouseEnterHandler} class="profile-tools">
							${user ? html`
								<li>
									<a class="nav-link" href="/edit-profile">EDIT PROFILE</a>
								</li>
								<li>
									<a class="nav-link" @click=${onLogout} href="javascript:void(0)">LOG OUT</a>
								</li>
							` : html`
								<li>
									<a class="nav-link" href="/login">LOG IN</a>
								</li>
								<li>
									<a class="nav-link" href="/register">REGISTER</a>
								</li>
							`}
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	
	<main></main>
	
	<footer>
		<p>&copy; Genadi Fidanov ${new Date().getFullYear()}</p>
	
		<ul>
			<li>
				<a href="https://www.facebook.com" target="_blank"><img src="/images/facebook.svg" alt="facebook"></a>
			</li>
			<li>
				<a href="https://www.instagram.com" target="_blank"><img src="/images/instagram.svg" alt="instagram"></a>
			</li>
			<li>
				<a href="https://twitter.com" target="_blank"><img src="/images/twitter.svg" alt="twitter"></a>
			</li>
			<li>
				<a href="https://www.youtube.com" target="_blank"><img src="/images/youtube.svg" alt="youtube"></a>
			</li>
		</ul>
	</footer>
`