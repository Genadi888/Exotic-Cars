import page from "./lib/page.mjs";
import { addRender } from "./middlewares/render.js";
import { aboutUsView } from "./views/about-us.js";
import { carPicturesView } from "./views/car-pictures.js";
import { homeView } from "./views/home.js";

const main = document.querySelector('#main');
const root = main.attachShadow({ mode: 'open' });

page((ctx, next) => {
	ctx.topShadowRoot = root;
	next();
});
page(addRender(root));

page('/index.html', '/');
page('/', homeView);
page('/car-pictures', carPicturesView);
page('/about-us', aboutUsView);
page.start();