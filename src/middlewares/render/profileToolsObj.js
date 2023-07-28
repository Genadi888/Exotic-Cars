export const profileToolsObj = {
	hoveredOverProfileTools: false,
	workerExists: false,

	getPictureMouseOverHandler() {
		function handler(ev) {
			const toolsList = ev.currentTarget.parentElement.querySelector('.profile-tools');
			toolsList.style.transition = 'opacity ease-in-out 200ms';
			toolsList.classList.add('profile-tools-active');
		}
		return handler.bind(this);
	},

	getPictureMouseLeaveHandler() {
		function handler(ev) {
			const picture = ev.currentTarget;

			if (this.workerExists) {
				return;
			}

			//? We assign the intensive task of creating a timeout to the worker.
			const worker = new Worker('/src/middlewares/render/timeoutWorker.js');
			this.workerExists = true;

			worker.addEventListener('message', () => {
				//? We will recieve a message from the worker after the tiomeout has ended.
				if (!this.hoveredOverProfileTools) {
					picture.parentElement.querySelector('.profile-tools').classList.remove('profile-tools-active');
				}
				worker.terminate();
				this.workerExists = false;
			});
		}
		return handler.bind(this);
	},

	getProfileToolsMouseEnterHandler() {
		function handler() {
			this.hoveredOverProfileTools = true;
		}
		return handler.bind(this);
	},

	getProfileToolsMouseLeaveHandler() {
		function handler(ev) {
			ev.currentTarget.classList.remove('profile-tools-active');
			this.hoveredOverProfileTools = false;
		}
		return handler.bind(this);
	},

	getProfileToolsMouseClickHandler() {
		function handler(ev) {
			ev.currentTarget.classList.remove('profile-tools-active');
			this.hoveredOverProfileTools = false;
		}
		return handler.bind(this);
	},
}