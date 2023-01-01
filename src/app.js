import page from "./lib/page.mjs";
import { addLogout } from "./middlewares/logout.js";
import { addRender } from "./middlewares/render.js";
import { addSession } from "./middlewares/session.js";
import { aboutUsView } from "./views/about-us.js";
import { carPicturesView } from "./views/car-pictures/car-pictures.js";
import { editPostView } from "./views/edit-post.js";
import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { registerView } from "./views/register.js";
import { sharePhotosView } from "./views/share-photos.js";
import { showroomsView } from "./views/showrooms.js";
import { verifyView } from "./views/verify.js";

const main = document.querySelector('#main');
const root = main.attachShadow({ mode: 'open' });

page((ctx, next) => {
	ctx.topShadowRoot = root;
	next();
});

page(addSession())
page(addLogout())
page(addRender());
page((ctx, next) => {
	window.scrollTo({ top: 0 });
	next();
});

page('/index.html', '/');
page('/', homeView);
page('/car-pictures', carPicturesView);
page('/about-us', aboutUsView);
page('/showrooms', showroomsView);
page('/share-photos', sharePhotosView);
page('/share-photos:id', editPostView);
page('/login', loginView);
page('/register', registerView);
page('/verify', verifyView);
page.start();