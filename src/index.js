const fonts = require('google-fonts');
const transform = require('dom-css-transform');
const mousePosition = require('mouse-position');
const smoothScroll = require('smooth-scroll');

const min = a => Math.min.apply(this, a);
const max = a => Math.max.apply(this, a);
const extents = a => [min(a), max(a)];
const map = (n, a1, a2, b1, b2) => ((n-a1)/(a2-a1))*(b2-b1)+b1;
const norm = (n, e) => map(n, e[0], e[1], 0, 1);
const slicePoints = (a, p) => a.slice(p[0], p[1]);

let header = document.querySelector('#header');
let mainNav = header.querySelector('.main-nav');
let mainNavMenuContainer = mainNav.querySelector('.main-nav-items');
let mainNavBtn = mainNav.querySelector('.main-nav-icon');

fonts.add({
	'Open Sans': true,
	'Overpass Mono': true
});


function scrollCallback(anchor, toggle) {
	// console.log(arguments);
	mainNav.classList.toggle('open');
}

smoothScroll.init({
	selector: '.main-nav-items a',
	easing: 'linear',
	offset: header.clientHeight,
	callback: scrollCallback
})

// grab info for each section
document.querySelectorAll("#main h1").forEach(function(el) {
	let title = el.innerHTML;
	let id = title.replace(/[^\w\s]/g, "");
	id = id.replace(/\s+/g, " ");
	id = id.toLowerCase().split(' ').join('-');

	el.id = id;

	mainNavMenuContainer.innerHTML += `<li class="main-nav-item"><a href="#${id}">${title}</a></li>`

}); 


mainNavBtn.addEventListener('click', function(event) {
	event.preventDefault();
	mainNav.classList.toggle('open');
});

document.body.addEventListener('keydown', function(event) {
	if( event.keyCode === 27 ) {
		console.log('Full screen!');
		requestFullScreen(document.documentElement);
	}
});

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

