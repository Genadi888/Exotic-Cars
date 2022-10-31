import { html, render as litRender } from "../lib/lit-html.js"

export function defineCarousel() {
	class Carousel extends HTMLElement {
		#carouselContainer = null;
		#carouselSlide = null;
		#carouselImages = null;

		#prevBtn = null;
		#nextBtn = null;

		#counter = 1;
		#autoNextAllowed = true;
		#swipeAllowed = true;

		#_size = null;

		get #imageSize() {
			if (this.#_size == null) {
				return new Promise(resolve => {
					this.#carouselImages[0].addEventListener('load', () => {
						this.#_size = this.#carouselImages[0].clientWidth;
						resolve(this.#carouselImages[0].clientWidth);
					})
				})
			} else {
				return this.#_size;
			}
		}

		set #imageSize(val) {
			this.#_size = val;
		}

		#timeoutId_next = null;
		#timeoutId_prev = null;
		#intervalId_autoNext = null;

		#initialX = null;

		constructor() {
			super();

			this.attachShadow({ mode: 'open' });

			litRender(html`
				<link rel="stylesheet" href="/css/home-carousel.css">
				
				<div class="carousel-container">
					<div class="carousel-slide">
						<img src="/images/bmw-i8-roadster.webp" id="lastClone" alt="bmw">
						<img src="/images/mercedes-benz.webp" alt="mercedes">
						<img src="/images/Lamborghini-Huracan-Tecnica-facelift-2022_2.webp" alt="lambo">
						<img src="/images/bmw-i8-roadster.webp" alt="dodge">
						<img src="/images/mercedes-benz.webp" id="firstClone" alt="mercedes">
					</div>
				
					<button id="prevBtn">&#8656;</button>
					<button id="nextBtn">&#8658;</button>
				</div>
			`, this.shadowRoot);

			this.#intervalId_autoNext = setInterval(() => {
				if (this.#autoNextAllowed) {
					this.#onNext();
				}
			}, 3000);
		}

		#windowFocus() {
			this.#autoNextAllowed = true;
		}

		#windowBlur() {
			this.#autoNextAllowed = false;
			clearTimeout(this.#timeoutId_prev);
			clearTimeout(this.#timeoutId_next);
		}

		async #windowResize() {
			this.#carouselSlide.style.transition = 'none';
			this.#imageSize = this.#carouselImages[0].clientWidth;
			this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
		}

		async #onNext() {
			if (this.#counter >= this.#carouselImages.length - 1) {
				return;
			}
			this.#imageSize
			this.#counter++;
			this.#carouselSlide.style.transition = 'transform 0.4s ease-in-out';
			this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
		}

		async #onPrev() {
			if (this.#counter <= 0) {
				return;
			}
			this.#counter--;
			this.#carouselSlide.style.transition = 'transform 0.4s ease-in-out';
			this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
		}

		#disableActionsAndControlAutoNext(btn, timeoutId) {
			btn.disabled = true;
			setTimeout(() => {
				btn.removeAttribute('disabled');
			}, 500);

			clearTimeout(timeoutId);

			if (!this.#autoNextAllowed) {
				return;
			}

			timeoutId = setTimeout(() => {
				this.#autoNextAllowed = true;
			}, 5000);

			this.#autoNextAllowed = false;
		}


		//? below are the lifecycle events

		async connectedCallback() {
			if (!this.isConnected) { //? just to be sure :)
				return;
			}

			this.#carouselContainer = this.shadowRoot.querySelector('.carousel-container');
			this.#carouselSlide = this.shadowRoot.querySelector('.carousel-slide');
			this.#carouselImages = this.shadowRoot.querySelectorAll('.carousel-slide img');

			this.#prevBtn = this.shadowRoot.querySelector('#prevBtn');
			this.#nextBtn = this.shadowRoot.querySelector('#nextBtn');

			window.addEventListener('focus', this.#windowFocus.bind(this));
			window.addEventListener('blur', this.#windowBlur.bind(this));

			window.addEventListener('resize', this.#windowResize.bind(this))

			this.#prevBtn.addEventListener('click', () => {
				this.#disableActionsAndControlAutoNext(this.#prevBtn, this.#timeoutId_prev);
				this.#onPrev();
			});

			this.#nextBtn.addEventListener('click', () => {
				this.#disableActionsAndControlAutoNext(this.#nextBtn, this.#timeoutId_next);
				this.#onNext();
			});

			this.#carouselSlide.addEventListener('transitionend', async () => {
				if (this.#carouselImages[this.#counter].id == 'lastClone') {
					this.#carouselSlide.style.transition = 'none';
					this.#counter = this.#carouselImages.length - 2;
					this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
				} else if (this.#carouselImages[this.#counter].id == 'firstClone') {
					this.#carouselSlide.style.transition = 'none';
					this.#counter = this.#carouselImages.length - this.#counter;
					this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
				}
			})

			this.#carouselContainer.addEventListener('touchstart', ev => {
				this.#initialX = ev.targetTouches['0'].clientX;
			})

			this.#carouselContainer.addEventListener('touchend', ev => {
				if (!this.#swipeAllowed) {
					return;
				}

				const lastX = ev.changedTouches['0'].clientX;

				if (lastX - this.#initialX >= 20) {
					this.#disableActionsAndControlAutoNext(this.#prevBtn, this.#timeoutId_prev);
					this.#onPrev();
				} else if (lastX - this.#initialX <= -20) {
					this.#disableActionsAndControlAutoNext(this.#nextBtn, this.#timeoutId_next);
					this.#onNext();
				}

				this.#swipeAllowed = false;
				setTimeout(() => {
					this.#swipeAllowed = true;
				}, 500);
			})

			this.#carouselSlide.style.transform = `translateX(${(-(await this.#imageSize) * this.#counter)}px)`;
		}

		disconnectedCallback() {
			window.removeEventListener('focus', this.#windowFocus);
			window.removeEventListener('blur', this.#windowBlur);
			window.removeEventListener('resize', this.#windowResize);
			this.#windowBlur(); //? we use this to clear some timeouts
			clearInterval(this.#intervalId_autoNext);
		}
	}

	window.customElements.define('image-carousel', Carousel);
}