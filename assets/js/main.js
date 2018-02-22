"use strict";

// page loading (preloader)
jQuery(window).on("load", function() {
  setTimeout(function () {
    jQuery(".preloader").fadeOut("slow");
    jQuery("#cd-page-content").css("opacity", "1");
  }, 1000);

});

///// starting document ready functions /////
jQuery("document").ready(function(){
  // fixed navigation
  var navDefault = jQuery(".cd-main-navigation");

  // fixed navbar
  jQuery(window).on("scroll", function(){
    if (jQuery(this).scrollTop() > jQuery(navDefault).outerHeight() + 40) {
      jQuery(".navbar-inverse").css("display", "none");
    }else{
      jQuery(".navbar-inverse").css("display", "flex");
    }
  });

  // changing background from html
  jQuery.each(jQuery("[data-bg]"), function(){
      if (jQuery(this).attr("data-bg").length > 0){
        jQuery(this).css("background-image", "url("+ jQuery(this).attr("data-bg") +")");
      }
  });

  /////  initializing Select2.js /////////
    jQuery('select').select2({
      placeholder: "Any",
    });
    // placeholders
    jQuery(".select-region").select2({
      placeholder: "Select region"
    });
    jQuery(".select-fuel").select2({
      placeholder: "Fuel type"
    });
    jQuery(".body-style").select2({
      placeholder: "Body style"
    });
    jQuery(".select-transmission").select2({
      placeholder: "Transmission"
    });
    jQuery(".select-drive").select2({
      placeholder: "Driveline"
    });

    // hiding search box
    jQuery(".js-example-basic-hide-search").select2({
      minimumResultsForSearch: Infinity,
      dropdownCssClass: "custom-dropdown",
    });

    //change arrow down
    jQuery('b[role="presentation"]').hide();
    jQuery('.select2-selection__arrow').append('<i class="fa fa-angle-down"></i>');

    //select2 with checkbox
    jQuery(".custom-select-list .select2").on("click", function () {
      jQuery(this).addClass("selected");
    });

  ///// end initializing Select2.js /////////

  // show more items
  jQuery(".show-more-btn").on('click', function() {
    jQuery(this).parent().find("li.invisible").fadeToggle().css("visibility", "visible");
    jQuery(this).text(function(i, text){
      return text === "Show less" ? "Show all sizes" : "Show less";
    });
  });

  // carousel for offers
  jQuery(".cd-offer-img").on("mouseup", function(){
    window.location = jQuery(this).find(".cd-offer-lnk").attr("href");
  });
  var owl = jQuery(".cd-hover-gal");
      owl.owlCarousel({
          items: 1,
          margin: 0,
          animateOut: 'fadeOut',
          animateIn:  'fadeIn',
          smartSpeed: 450,
      });
  jQuery(".cd-hover-gal .owl-dot").hover(function() {
      jQuery(this).trigger("click");
      }, function() {}
  );
  resize_dots();
  owl.on("mouseleave", function(){
      jQuery(this).find(".owl-dot").first().click();
  });

  // bootstrap carousel touch swipe support
  jQuery("#cd-item-slider, #cd-main-carousel, #rent-me").swipe({
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
      if (direction == 'left') jQuery(this).carousel('next');
      if (direction == 'right') jQuery(this).carousel('prev');
    },
    allowPageScroll:"vertical"
  });

  // carousel progress bar
  if (jQuery(".rent-carousel").width() > 0) {
    var percent = 0,
    interval = 30,//it takes about 6s, interval=20 takes about 4s
    $bar = $('.transition-timer-carousel-progress-bar'),
    $crsl = $('.rent-carousel');
    
    $crsl.carousel({//initialize
      interval: false,
      pause: true,
    }).on('slide.bs.carousel', function (){percent = 0;});        //This event fires immediately when the bootstrap slide instance method is invoked.
    var barInterval = setInterval(progressBarCarousel, interval); //set interval to progressBarCarousel function
    if (!(/Mobi/.test(navigator.userAgent))) {                    //tests if it isn't mobile
      $crsl.hover(function(){
            clearInterval(barInterval);
          },
          function(){
            barInterval = setInterval(progressBarCarousel, interval);
          }
      );
    }    
  }
  function progressBarCarousel() {
    $bar.css({width:percent+'%'});
    percent = percent +0.5;
    if (percent>=100) {
      percent=0;
      $crsl.carousel('next');
    }
  }
    

  // slick carousel for rent-item.html
  if( jQuery(".cd-rent-car-slide").width() > 0 ){
    jQuery(".rent-item-carousel").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: ".rent-item-thumbs"
    });
    jQuery(".rent-item-thumbs").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: ".rent-item-carousel",
      focusOnSelect: true,
      nextArrow: '<button type="button" class="slick-next">Next images <i class="fa fa-angle-right"></i></button>',
      prevArrow: false,
      responsive: [
        {
          breakpoint: 600,
          settings: {slidesToShow: 3}
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            
          }
        }
      ]
    });
  }

  // smooth scroll to div
  jQuery(function() {
    jQuery('.local-lnk').on("click",function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = jQuery(this.hash);
        target = target.length ? target : jQuery('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          jQuery('html, body').animate({
            scrollTop: target.offset().top - 160
          }, 1000);
          return false;
          }
        }
      });
    });

  // testimonials carousel
  jQuery('.testimonials-carousel, .side-testimonials').owlCarousel({
    loop:true,
    margin:10,
    dots: true,
    items: 1,
  });



  // color tooltips
  jQuery(function () {
    jQuery('[data-toggle="tooltip"]').tooltip({container: 'body'});
  });
  // select color
  jQuery(".color-list.single .btn").on("click", function(){
    jQuery(this).closest('ul').find('.selected').removeClass('selected');
    jQuery(this).addClass('selected');
  });
  jQuery(".color-list.multiple .btn").on("click", function(){
    jQuery(this).toggleClass('selected');
  });

  // collapse ellements on mobile
  if(jQuery(window).width() < 767){
    jQuery(".cd-widget-content").addClass("collapse");
    // open collapsed blocks
    jQuery(".cd-widget-title").on("click", function(){
      jQuery(this).siblings().toggleClass("collapsed collapse");
    });
  }

  var touch = 'ontouchstart' in document.documentElement
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0;

  if (touch) { // remove all :hover stylesheets
      try { // prevent exception on browsers not supporting DOM styleSheets properly
          for (var si in document.styleSheets) {
              var styleSheet = document.styleSheets[si];
              if (!styleSheet.rules) continue;

              for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                  if (!styleSheet.rules[ri].selectorText) continue;

                  if (styleSheet.rules[ri].selectorText.match(':hover')) {
                      styleSheet.deleteRule(ri);
                  }
              }
          }
      } catch (ex) {}
  }

  // showing/hiding placeholders
  jQuery(function () {
      jQuery('input, textarea').on("focus",function () {
          jQuery(this).data('value', jQuery(this).attr('value'))
                 .attr('value', '');
      }).blur(function () {
          jQuery(this).attr('value', jQuery(this).data('value'));
      });
  });

  // add new car to list search in search-results.html
  jQuery(".addToList").on('click', function() {
    jQuery(".new-vehicle").fadeToggle();
    $(this).text(function(i, text){
      return text === "Remove" ? "Add vehicle" : "Remove";
    });
  });

  /// change content view search-results.html ///
  jQuery("#switchBtn").on("click", function(e){
    jQuery("#offers-inline").fadeToggle(1000);
    jQuery("#block-offers").fadeToggle(1000);
    $(this).text(function(i, text){
      return text === "Switch to defaul view" ? "Switch to block view" : "Switch to defaul view";
    });
  });
  jQuery("#mapView").on('click', function(e) {
    jQuery("#demoCars").fadeToggle(1000);
    jQuery(".full-map").toggleClass('visible');
    $(this).text(function(i, text){
      return text === "Hide map" ? "Show on map" : "Hide map";
    });
  });

  if ($(".full-map").hasClass('visible')) {
    $("#demoCars").fadeOut();

    jQuery("#mapView").on('click', function(e) {
      jQuery(".full-map").toggleClass('visible2');
      $(this).text(function(i, text){
        return text === "Show on map" ? "Hide map" : "Show on map";
      });
    });
  }

  /// add touch swipe for jquery ui range slider ///
  $('.ui-slider-handle').draggable(); // touch on devices ;-)

  // show search features in search-results.HTML
  jQuery(".showFeatures").on('click', function() {
    jQuery("#cd-search-features").addClass('visible');
    jQuery(".search-results-wrapp > .container").fadeOut();
  });
  jQuery("#cd-search-features .close").on('click', function() {
    jQuery("#cd-search-features").removeClass('visible');
    jQuery(".search-results-wrapp .container").fadeIn();
  });


  // setting equal height of account control and cd-my-list blocks on my-account.html
	var targHeight = jQuery(".cd-my-list").outerHeight();
	var initHeight = jQuery(".account-control").outerHeight();
	if (initHeight < targHeight) {
		jQuery(".account-control").css('height', targHeight);
	}

  ///// window on scroll functions /////
  jQuery(window).on("scroll", function() {
    // show animated icons on block 'Why Us'
    if (jQuery(".benefits").width() > 0) {
      if (jQuery(window).scrollTop() >= jQuery(".benefits").offset().top - (jQuery(window).height() / 2) ) {
          jQuery(".benefits").addClass('visible');
      }
    }

  });
  ///// end window on scroll functions /////

  //rezervations day and time pickers
  jQuery(function() {

    $(".daySelect").datetimepicker({
  		timepicker:false,
    	format:'Y-m-d',
      scrollInput: false,
      hours12: true, //time format 24h/12h
  	});

  	$(".timeSelect").datetimepicker({
  		datepicker:false,
      ampm: true, // FOR AM/PM FORMAT
      format : 'g:i A',
      scrollInput: false,
      hours12: true, //time format 24h/12h
  	});

  });


  // lightbox initializing
  if(jQuery(".full-article-wrapp").width() > 0){
    jQuery('.lightbox-item').magnificPopup({
      type:    'image',
      gallery: { enabled:true, }
    });
  }

  jQuery(".respond-form-bg").css({'height':(jQuery(".comment-respond").height()+'px')});

  jQuery("a[href='#last-month']").one("click", function(e){
    e.preventDefault();
    drawSecond();
  }); 

});
///// end document ready /////



// show discount input
jQuery(".addLoc").on("click", function(){
  jQuery(this).parent().find(".customLoc").fadeToggle();
  jQuery(this).text(function(i, text){
    return text === "Same as pick-up place" ? "Specify a different drop-off location" : "Same as pick-up place";
  })
});
jQuery(".discount-chekbox").on("click", function(){
  jQuery(".discount-input").fadeToggle();
});

// resize dots from car offers carousel
function resize_dots(){
  var dots=jQuery(".owl-dots");
  dots.each(function(){
    jQuery(this).find(".owl-dot").css("width",100/$(this).find(".owl-dot").length+"%");
  });
}

///// map loading /////
if(jQuery("#cd-map").width() > 0){
  // When the window has finished loading create our google map below
      google.maps.event.addDomListener(window, 'load', init);
      function init() {
        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
            zoom: 12,
            scrollwheel: false,
            mapTypeControl: false,
            draggable: true,
            center: new google.maps.LatLng(40.6700, -73.9400),
            styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
        };
        var mapElement = document.getElementById('cd-map');
        var map = new google.maps.Map(mapElement, mapOptions);
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(40.6700, -73.9400),
          map: map,
        });
      }
}
///// end map loading /////

// refresh page on resize window
$(window).on('orientationchange', function(){location.reload();});


// photo gallery (car-submit) hover function
jQuery(function() {
  jQuery(' #upload-list > li ').each( function() { jQuery(this).hoverdir(); } );
});

///// range values /////
if (jQuery(".cd-top-search").width() > 0) {
  // prices Up to -> range
  $( function() {
    $( "#priceUpRange" ).slider({
      range: "min",
      min: 0,
      max: 35000,
      value: 5000,
      slide: function( event, ui ) {
        $( "#priceUp" ).val( ui.value );
      }
    });
    $( "#priceUp" ).val( $( "#priceUpRange" ).slider( "value" ) );
  } );

  // registration range to -> range
  $( function() {
    $( "#registrationRange" ).slider({
      range: "max",
      min: 1980,
      max: 2017,
      value: 2010,
      slide: function( event, ui ) {
        $( "#cd-registration" ).val( ui.value );
      }
    });
    $( "#cd-registration" ).val( $( "#registrationRange" ).slider( "value" ) );
  } );

  // mileage up to -> range
  $( function() {
    $( "#mileageRange" ).slider({
      range: "min",
      min: 0,
      max: 500,
      value: 150,
      slide: function( event, ui ) {
        $( "#cd-mileage" ).val( ui.value + "K");
      }
    });
    $( "#cd-mileage" ).val( $( "#mileageRange" ).slider( "value" ) + "K");
  } );
}
///// end of range values /////

///// cd-search-sidebar ranges /////
if (jQuery(".cd-search-sidebar, .elements").width() > 0) {
  // 1st registration range
  jQuery( function() {
      jQuery( "#regYearsRange" ).slider({
        range: true,
        min: 1990,
        max: 2020,
        values: [ 2003, 2016 ],
        slide: function( event, ui ) {
          jQuery( "#regYears" ).val( ui.values[ 0 ] );
          jQuery( "#regYears2" ).val( ui.values[ 1 ]);
        }
      });
      jQuery( "#regYears" ).val( jQuery( "#regYearsRange" ).slider( "values", 0 ) );
      jQuery( "#regYears2" ).val( jQuery( "#regYearsRange" ).slider( "values", 1 ) );
  } );

  // location range
  $( function() {
    $( "#carLocRange" ).slider({
      range: "min",
      min: 0,
      max: 500,
      value: 150,
      slide: function( event, ui ) {
        $( "#locRange" ).val( ui.value );
      }
    });
    $( "#locRange" ).val( $( "#carLocRange" ).slider( "value" ) );
  } );

  // price range
  $( function() {
    $( "#carPriceRange" ).slider({
      range: true,
      step: 0.05,
      min: 3.5,
      max: 55.50,
      values: [12.5, 25.05],
      slide: function( event, ui ) {
        $( "#carPrice" ).val( ui.values[ 0 ] );
        $( "#carPrice2" ).val( ui.values[ 1 ] );
      }
    });
    $( "#carPrice" ).val( $( "#carPriceRange" ).slider( "values", 0 ) );
    $( "#carPrice2" ).val( $( "#carPriceRange" ).slider( "values", 1 ) );
  } );

  // mileage range
  $( function() {
      $( "#carMileageRange" ).slider({
        range: true,
        min: 1,
        max: 350,
        values: [ 50, 250 ],
        slide: function( event, ui ) {
          $( "#carMileage" ).val( ui.values[ 0 ] );
          $( "#carMileage2" ).val( ui.values[ 1 ]);
        }
      });
      $( "#carMileage" ).val( $( "#carMileageRange" ).slider( "values", 0 ) )
      $( "#carMileage2" ).val( $( "#carMileageRange" ).slider( "values", 1 ) );
  } );

  // engine volume range
  $( function() {
    $( "#engineVolRange" ).slider({
      range: true,
      min: 1000,
      max: 7000,
      values: [ 2147, 5500 ],
      slide: function( event, ui ) {
        $( "#engineVol" ).val( ui.values[ 0 ] );
        $( "#engineVol2" ).val( ui.values[ 1 ]);
      }
    });
    $( "#engineVol" ).val( $( "#engineVolRange" ).slider( "values", 0 ) );
    $( "#engineVol2" ).val( $( "#engineVolRange" ).slider( "values", 1 ) );
  } );
  // engine power range
  $( function() {
    $( "#enginePowRange" ).slider({
      range: true,
      min: 100,
      max: 500,
      values: [201, 350],
      slide: function( event, ui ) {
        $( "#enginePow" ).val( ui.values[ 0 ] );
        $( "#enginePow2" ).val( ui.values[ 1 ] );
      }
    });
    $( "#enginePow" ).val( $( "#enginePowRange" ).slider( "values", 0 ) );
    $( "#enginePow2" ).val( $( "#enginePowRange" ).slider( "values", 1 ) );
  } );

}
///// end .cd-search-sidebar ranges /////

///// KEN burn effect for bootsrtap carousel /////
function doAnimations(elems) {
  //Cache the animationend event in a variable
  var animEndEv = 'webkitAnimationEnd animationend';
      elems.each(function () {
      var $this = $(this),
          $animationType = $this.data('animation');
          $this.addClass($animationType).one(animEndEv, function () {
            $this.removeClass($animationType);
          });
      });
  }
  //Variables on page load
  var $immortalCarousel = $('.animate_text'),
      $firstAnimatingElems = $immortalCarousel.find('.item:first').find("[data-animation ^= 'animated']");
  //Initialize carousel
  $immortalCarousel.carousel();
  //Animate captions in first slide on page load
  doAnimations($firstAnimatingElems);
  //Other slides to be animated on carousel slide event
  $immortalCarousel.on('slide.bs.carousel', function (e) {
    var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
    doAnimations($animatingElems);
  });
///// end KEN burn effect for bootsrtap carousel /////


// copy to clipboard function
if(jQuery(".demo-icon-blk").width() > 0){
  var clipboard = new Clipboard('.copyToClipBoard');
}
jQuery('[data-toggle="popover"]').popover().on("click",function () {
  setTimeout(function () {
      jQuery('[data-toggle="popover"]').popover('hide');
  }, 1000);
});

/* custom functions bloks.html */

// registration range2 to -> range2
$( function() {
  $( "#registrationRange2" ).slider({
    range: "max",
    min: 1980,
    max: 2017,
    value: 2010,
    slide: function( event, ui ) {
      $( "#cd-registration2" ).val( ui.value );
    }
  });
  $( "#cd-registration2" ).val( $( "#registrationRange2" ).slider( "value" ) );

  $( "#priceUpRange2" ).slider({
    range: "min",
    min: 0,
    max: 35000,
    value: 5000,
    slide: function( event, ui ) {
      $( "#priceUp2" ).val( ui.value );
    }
  });
  $( "#priceUp2" ).val( $( "#priceUpRange2" ).slider( "value" ) );

  $( "#mileageRange2" ).slider({
    range: "min",
    min: 0,
    max: 500,
    value: 150,
    slide: function( event, ui ) {
      $( "#cd-mileage2" ).val( ui.value + "K");
    }
  });
  $( "#cd-mileage2" ).val( $( "#mileageRange2" ).slider( "value" ) + "K");

} );




// counting numbers
if (jQuery("section.overview").width() > 0) {
  $(function() {
      var $meters  = $(".count");
      var $section = $('section.overview');
      var $queue   = $({});
      function loadNumbers(){
          $('.count').each(function () {
              $(this).prop('Counter',0).animate({
              Counter: $(this).text()
              }, {
                  duration: 2000,
                  easing: 'swing',
                  step: function (now) {
                      $(this).text(Math.ceil(now));
                  }
              });
          });
      }
      $(document).on('scroll', function(ev) {
          var scrollOffset = $(document).scrollTop();
          var containerOffset = $section.offset().top - window.innerHeight + 200;
          if (scrollOffset > containerOffset) {
              loadNumbers();
              jQuery(".count-blk").addClass('visible');
              // stop event
              $(document).unbind('scroll');
          }
      });
  });
}

// show more options filter to fixed bottom bar
jQuery("#showOptions").on("click", function(){
  jQuery(".bottom-search").toggleClass('more-options');
  jQuery(this).text(function(i, text){
    return text === "Less search options" ? "More search options" : "Less search options";
  })
});

if (jQuery(".subscribe").width() > 0) {
  // change accordion text
  jQuery('#faq-accordion').on('hidden.bs.collapse', function () {
    jQuery("a[aria-expanded='false'] small").text("Show answer");
    jQuery("a[aria-expanded='true'] small").text("Hide answer");
  });
}


// FANTASTIC SLIDER
if (jQuery(".slider-wrapp, .hero-section").width() > 0) {
  initSlider();

  // scroll parallax effect
  var rellax = new Rellax('.rellax');
}

  //carousel
  function initSlider() {
    var fantastic = jQuery('#cd-fantastic');
    fantastic.owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      margin: 0,
      onInitialized: startProgressBar,
      onTranslate: resetProgressBar,
      onTranslated: startProgressBar,
    });

    // add animate.css class(es) to the elements to be animated
    function setAnimation ( elem, _InOut ) {
      var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      elem.each ( function () {
        var $elem = $(this);
        var $animationType = 'animated ' + $elem.data( 'animation-' + _InOut );
        $elem.addClass($animationType).one(animationEndEvent, function () {
          $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
        });
      });
    }
    // Fired after current slide has been changed
    fantastic.on('changed.owl.carousel', function (event) {
        var $currentItem = $('.owl-item', fantastic).eq(event.item.index);
        var $elemsToanim = $currentItem.find("[data-animation-in]");
        setAnimation ($elemsToanim, 'in');
    });

  }
  function startProgressBar() {
    // apply keyframe animation
    jQuery('.slide-progress').css({
      'width': '100%',
      'transition': 'width 5000ms'
    });
  }
  function resetProgressBar() {
    jQuery('.slide-progress').css({
      'width': 0,
      'transition': 'width 0s'
    });
  }

// end FANTASTIC SLIDER


// registration range
jQuery( function() {
    jQuery( "#regYearsRange3" ).slider({
      range: true,
      min: 1990,
      max: 2020,
      values: [ 2003, 2016 ],
      slide: function( event, ui ) {
        jQuery( "#regYears3" ).val( ui.values[ 0 ] );
        jQuery( "#regYears4" ).val( ui.values[ 1 ]);
      }
    });
    jQuery( "#regYears3" ).val( jQuery( "#regYearsRange3" ).slider( "values", 0 ) );
    jQuery( "#regYears4" ).val( jQuery( "#regYearsRange3" ).slider( "values", 1 ) );
} );


// main margin bottom
jQuery(function(){
  var footerH = jQuery("#cd-page-content footer").innerHeight();
  var mainT   = jQuery("#cd-page-content main");
  jQuery(mainT).css("margin-bottom", footerH);
});

// full-map hright
jQuery(function(){
  var sidebarH = jQuery(".cd-search-sidebar").innerHeight();
  var mapH   = jQuery(".full-map");
  jQuery(mapH).css("height", sidebarH);
});


// navbar fixed bottom for mobiles
if (jQuery(window).width() < 600) {

  jQuery(".navbar-fixed-bottom").addClass("small");
  jQuery(".navbar-fixed-bottom .show-nav").on("click", function(){
    jQuery(".navbar-fixed-bottom").toggleClass("small");
    jQuery(this).text(function(i, text){
      return text === "Hide" ? "Show selected" : "Hide";
    });
  });
  
  // disable parallax for mobile
  if (jQuery(".slider-wrapp, .hero-section").width() > 0) {
   rellax.destroy();
  }
 


}



// disble right click on inspect element
// document.addEventListener('contextmenu', function(e) {
//   e.preventDefault();
// });
