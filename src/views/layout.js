import { html } from "../lib/lit-html.js";
import { getCollapseClickHandler } from "../util.js";

export const layoutTemplate = (body, topShadowRoot, onLogout, user) => html`
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<link rel="stylesheet" href="/css/navbar-and-footer.css">
	
	<div id="drop-down-menu-container">
		<div class="navbar-nav">
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
				<li class="nav-item">
					<a class="nav-link" href="/login">LOG OUT</a>
				</li>
			` : html`
				<li class="nav-item">
					<a class="nav-link" href="/login">LOG IN</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/register">REGISTER</a>
				</li>
			`}
			<li class="nav-item">
				<ul class="social-media-list">
					<li>
						<a href="https://www.facebook.com" target="_blank"><img src="/images/facebook.svg"
								alt="facebook"></a>
					</li>
					<li>
						<a href="https://www.instagram.com" target="_blank"><img src="/images/instagram.svg"
								alt="instagram"></a>
					</li>
					<li>
						<a href="https://twitter.com" target="_blank"><img src="/images/twitter.svg" alt="twitter"></a>
					</li>
					<li>
						<a href="https://www.youtube.com" target="_blank"><img src="/images/youtube.svg" alt="youtube"></a>
					</li>
				</ul>
			</li>
		</div>
	</div>
	<nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a href="/">
				<img width="50px" height="50px" src="/images/site-logo.png" alt="sports car">
			</a>
			<a class="navbar-brand" href="/">Exotic Cars</a>
			<button @click=${getCollapseClickHandler(topShadowRoot)} id="collapse-button"
				class="navbar-toggler" type="button"
				data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
	
			<div class="collapse navbar-collapse" id="navbarNav">
				<div class="navbar-nav" id="inline-navbar-nav">
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
					${user ? html`
						<li class="nav-item">
							<a class="nav-link" href="/login">LOG OUT</a>
						</li>
					` : html`
						<li class="nav-item">
							<a class="nav-link" href="/login">LOG IN</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/register">REGISTER</a>
						</li>
					`}
					<li class="nav-item">
						<ul class="social-media-list">
							<li>
								<a href="https://www.facebook.com" target="_blank"><img src="/images/facebook.svg"
										alt="facebook"></a>
							</li>
							<li>
								<a href="https://www.instagram.com" target="_blank"><img src="/images/instagram.svg"
										alt="instagram"></a>
							</li>
							<li>
								<a href="https://twitter.com" target="_blank"><img src="/images/twitter.svg"
										alt="twitter"></a>
							</li>
							<li>
								<a href="https://www.youtube.com" target="_blank"><img src="/images/youtube.svg"
										alt="youtube"></a>
							</li>
						</ul>
					</li>
				</div>
			</div>
		</div>
	</nav>
	
	<main>
		${body}
	</main>
	
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