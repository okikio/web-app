// import swup from "swup";
import el from "./components/ele"; // , { define, html }
// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";
// import slideTheme from '@swup/slide-theme';
// import preload from '@swup/preload-plugin';
// let _load = () => { };
let _log = (...args) => args.forEach(v => console.log(v));
let ele = el(`<a class='Name'>Hello</a>`);
ele.prependTo("#swup");
ele.on("click", function () {
	_log(this);
	el(this).animate({
		color: "#ffeeaa",
		translateX: 250
	});
});

el('main').find(`a.Name`).on("click mouseenter", () => {
	// e.preventDefault();
	_log("Name");
});

el(function() {
	let $ = window.jQuery;
	// let _body = 
	let opts = {
        debug: true,
        prefetch: true,
        cacheLength: 4,
        onStart: {
          duration: 350, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            $container.addClass('is-animating');
 
            // Restart your animation
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 0,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            $container.removeClass('is-animating');
            
            // Inject the new content
            $container.html($newContent);
 
          }
        }
	},
	smoothState = $("#swup").smoothState(opts).data('smoothState');

	$(".navbar").on("click", "a[href^='/']", function (e) {
		e.preventDefault();
		smoothState.load($(this).attr("href"));
	});

	$(".navbar").on("hover", "a[href^='/']", function (e) {
		e.preventDefault();
		smoothState.fetch($(this).attr("href"));
	});
	// 
});

/*
el('main').on('click', '[data-type="page-transition"]', function(event){
   event.preventDefault();
   //detect which page has been selected
   var newPage = el(this).attr('href');
   //if the page is not animating - trigger animation
   if( !isAnimating ) changePage(newPage, true);
});
function changePage(url, bool) {
   isAnimating = true;
   // trigger page animation
   $('body').addClass('page-is-changing');
   //...
   loadNewContent(url, bool);
   //...
}
function loadNewContent(url, bool) {
   var newSectionName = 'cd-'+url.replace('.html', ''),
   section = $('<div class="cd-main-content '+newSectionName+'"></div>');
   section.load(url+' .cd-main-content > *', function(event){
      // load new content and replace <main> content with the new one
      $('main').html(section);
      //...
      $('body').removeClass('page-is-changing');
      //...

      if(url != window.location){
         //add the new page to the window.history
         window.history.pushState({path: url},'',url);
      }
   });
}
$(window).on('popstate', function() {
   var newPageArray = location.pathname.split('/'),
   //this is the url of the page to be loaded 
   newPage = newPageArray[newPageArray.length - 1];
   if( !isAnimating ) changePage(newPage);
});
*/

/* let trans = new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	},
	plugins: [new preload()]
});

_load();

// this event runs for every page view after initial load
trans.on('contentReplaced', _load); */