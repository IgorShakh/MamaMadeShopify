/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
/*--------------------------------------------------------------
  # Section feed Instagram feed
  --------------------------------------------------------------*/
// Full feed if required
// fetch(`https://d3ejra0xbg20rg.cloudfront.net/instagram/media?shop=${Shopify.shop}&resource=default`).then((response) => {
//     response.json().then((media) => {
//         console.log(media);
//     });
// });

// Build a box banner height adjustment for sticky filters
var BoxBanner = document.querySelector('.BoxBanner');
var paddingTop = 25;
if (BoxBanner) {
  function boxBannerResize() {
    var BannerHeight = (typeof(BoxBanner) != 'undefined' && BoxBanner != null) ? BoxBanner.clientHeight + paddingTop : 0;
    document.documentElement.style.setProperty('--box-banner-height', BannerHeight + 'px');
  }
  boxBannerResize();
  window.addEventListener("resize", boxBannerResize);
}


/*--------------------------------------------------------------
  # Testimonials & Aside Flickity
  --------------------------------------------------------------*/
var testimonialListAside = document.querySelector('.TestimonialList.TestimonialList--stack');
if (testimonialListAside) {
  var config = JSON.parse(testimonialListAside.getAttribute('data-flickity-config'));
  var flkty = new Flickity('.TestimonialList.TestimonialList--stack', config);

  // Filthy hack as events weren't working!
  // Possibly down toe Flickity version that's minifed and bundled in libs.min.js
  setTimeout(function() {
    testimonialListAside.classList.add('TestimonialList--init');
  }, 500);

  function flktyResize() {
    flkty.resize();
    flkty.reposition();
  }

  window.addEventListener("resize", flktyResize);
}

/*--------------------------------------------------------------
  # Homepage Slider
  --------------------------------------------------------------*/
  var homepageSlideshow = document.querySelectorAll('.home-slideshow__container');
  homepageSlideshow.forEach((item) => {
    if (item) {
      const targetElement = `.${item.dataset.id}`;
      var config = JSON.parse(item.getAttribute('data-flickity-config'));
      var homepageSlideshoFlkty = new Flickity(targetElement, config);

      // Filthy hack as events weren't working!
      // Possibly down toe Flickity version that's minifed and bundled in libs.min.js
      setTimeout(function() {
        item.classList.add('TestimonialList--init');
      }, 500);

      function homepageSlideshoFlktyResize() {
        homepageSlideshoFlkty.resize();
        homepageSlideshoFlkty.reposition();
      }

      window.addEventListener("resize", homepageSlideshoFlktyResize);
    }
  });

/*--------------------------------------------------------------
  # Announcement Bar - On close sets a cookie for 7 days
  --------------------------------------------------------------*/
var announcementBar = document.getElementById("shopify-section-announcement");
var announcementClose = document.getElementById("AnnouncementBar__Close");

if (!document.cookie.match(/^(.*;)?\s*MamaMadeAnnouncement\s*=\s*[^;]+(.*)?$/)) {
  announcementBar.style.display = "block";
} else {
  announcementBar.style.display = "none";
}

function setAgreeCookie() {
  var expire=new Date();
  expire=new Date(expire.getTime() + 7*24*60*60*1000); // expire in 7 days
  document.cookie="MamaMadeAnnouncement=visible; expires="+expire;
}

if (announcementClose) {
  announcementClose.onclick = function() {
    setAgreeCookie();
    announcementBar.style.display = "none";
  };
}


/*--------------------------------------------------------------
  # Split 2 Column Scroll
  --------------------------------------------------------------*/
function splitColumnScroll() {
  var t = document.querySelector(".reversed-columns__column--right");
  if (t) {
    var e = window.pageYOffset | document.body.scrollTop;
    t && (t.style.transform = "translateY(-100%) translateY(".concat((window.innerHeight - 67) + 2 * e, "px)"))
  }
}

splitColumnScroll();

window.addEventListener('scroll', function() {
	splitColumnScroll();
});

window.addEventListener("resize", splitColumnScroll);

/**
 *  Function Description
 */

// function fixedSearch() {
//   const searchAutocomplete = document.querySelectorAll('.algolia-autocomplete');
//   const header = document.querySelector('.Header');
//   const distanceToTop = header.getBoundingClientRect().top;
//   const searchAutocompleteTop = distanceToTop + 98 + 62;
//   const searchAutocompleteTopSm = distanceToTop + 80 + 62;

//   // Create a media condition that targets viewports at least 768px wide
//   const mediaQuery = window.matchMedia('(min-width: 768px)')
//   setTimeout(() => {
//     // Check if the media query is true
//     if (mediaQuery.matches) {
//       updateSearchAutocompleteTop(searchAutocomplete, searchAutocompleteTop)
//     } else {
//       updateSearchAutocompleteTop(searchAutocomplete, searchAutocompleteTopSm)
//     }
//   }, 120);
// }
// function updateSearchAutocompleteTop(target, height) {
//   target.forEach(element => {
//     element.style.top = `${height}px`;
//   });
// }

// fixedSearch()

// window.addEventListener('scroll', function() {
// 	// fixedSearch();
// });

// window.addEventListener("resize", fixedSearch);



/*--------------------------------------------------------------
  # Toggle Div Show/Hide
  --------------------------------------------------------------*/
function toggleDiv(div, element)
{
  document.getElementsByClassName(div)[0].style.display = element.value != "" ? 'block' : 'none';
  document.getElementsByClassName(div)[1].style.display = element.value != "" ? 'block' : 'none';
  document.getElementsByClassName(div)[2].style.display = element.value != "" ? 'block' : 'none';

  var productInfoHeight = document.getElementsByClassName('Product__Info')[0].clientHeight;
  document.getElementsByClassName('Product__Wrapper')[0].style.minHeight = productInfoHeight+'px';
}


/*--------------------------------------------------------------
  # Custom Quiz
  --------------------------------------------------------------*/
var myEles = document.querySelectorAll('.page-quiz button');
for(var i=0; i<myEles.length; i++){
  if(myEles[i].innerHTML == 'Learn More'){
    //use javascript to style
    myEles[i].setAttribute('class', "gotcha");
  }
}

/*--------------------------------------------------------------
  # Quick add
  --------------------------------------------------------------*/
const quick_selectors = {
  addToCart: '[js-quick-add="trigger"]',
};

function initQuickAdd() {
  const container = document.querySelectorAll(quick_selectors.addToCart);

  if(!container) { return }

  document.addEventListener('click', function (event) {
    // All click events will be handled by this function, so it needs to be as cheap as possible. To check
    // whether this function should be invoked, we're going to check whether the element that was clicked on
    // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
    const element = event.target;

    // Check if it matches our previously defined selector
    if (element.matches(quick_selectors.addToCart)) {
      quickAdd(element);
      button_adding(element);
    }
  });
}

function quickAdd(item) {
  let formData = {
    'items': [{
      'id': item.dataset.id,
      'quantity': item.dataset.quantity
    }]
  };

  var reload = item.dataset.reload;

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    var response_json = response.json();
    button_added(item);

    setTimeout(() => {
      if (reload === 'true') {
        location.reload();
      } else {
        fullCartRebuild();
      }
    }, 1000);

    return response_json;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function fullCartRebuild() {
  fetch(window.theme.localeRootUrl + '/cart?view=drawer' + '&timestamp=' + Date.now(), {
    credentials: 'same-origin',
    method: 'GET'
  }).then(function (content) {
    content.text().then(function (html) {
      const sidebar = $('#sidebar-cart');
      const newSidebar = $(html).html();

      sidebar.html(newSidebar);
      window.buildGlobalUpsell();
    });
  });
}

function button_adding(item) {
  item.value = 'Adding';
}

function button_added(item) {
  item.value = 'Added';
}

function button_default(item) {
  item.value = 'Add to cart';
}

initQuickAdd();


/**
 * Component: Table respond on click mobile
 * ------------------------------------------------------------------------------
 * A table component.
 *
 */

/**
 * Create a responsive table.
 */
function upsellAjax() {

  /**
 * DOM selectors.
 */
  const selectors = {
    wrapper: '.cart-collection-container',
    container: '.cart-collection--ajax',
    item: '.cart-collection-item',
    arrows: '.cart-collection-arrow',
    next: '.cart-collection-arrow--next',
    prev: '.cart-collection-arrow--prev',
  };

  /**
   * Initialise component.
   */
  function init() {
    loopContainers();
  }

  function loopContainers(){
    const addOnGroup = document.querySelectorAll(selectors.container);

    addOnGroup.forEach(container => {
      checkAddon(container);
    })
  }

  function checkAddon(container) {
    const items = container.querySelectorAll(selectors.item)
    if (!items) { return }
    build(container);
  }

  function addEventListeners(){
    const prev = document.querySelectorAll(selectors.prev);
    const next = document.querySelectorAll(selectors.next);

    prev.forEach(item => {
      slidePrev(item);
      item.addEventListener('click', function () {
        slidePrev(item);
      });
    })

    next.forEach(item => {
      item.addEventListener('click', function () {
        slideNext(item);
      });
    })
  }

  function slideNext(element) {
    const container = element.parentNode.querySelector(selectors.container);
    container.scrollLeft += 200;
  }

  function slidePrev(element) {
    const container = element.parentNode.querySelector(selectors.container);
    container.scrollLeft -= 200;
  }

  function build(container) {
    // addActiveClass(item);
    createArrow(container);
    setTimeout(() => {
      addEventListeners();
      showArrow(container);
    }, 1000);

    // window.addEventListener('resize', function(){
    //   showArrow(item);
    // });

    // const tableContainer = item.querySelector('.table-js__container');
    // tableContainer.addEventListener("scroll", function () {
    //   checkArrowActive(tableContainer)
    // });
  }

  function addActiveClass(item) {
    item.classList.add('is-active');
  }

  function createArrow(container) {
    container.parentNode.insertAdjacentHTML('beforeend', '<div class="cart-collection-arrow cart-collection-arrow--next"></div>');
    container.parentNode.insertAdjacentHTML('beforeend', '<div class="cart-collection-arrow cart-collection-arrow--prev"></div>');
  }

  // TODOD: Do I still need this
  function showArrow(container) {
    const containerWidth = container.offsetWidth;
    const gridWidth = container.querySelector('.cart-collection__grid').offsetWidth;
    const arrowsParent = container.parentNode.querySelector(selectors.wrapper)

    if (!arrowsParent) { return }

    const arrows = arrowsParent.querySelectorAll(selectors.arrows);

    arrows.forEach(function(item) {
      item.classList.add('is-active');
      // item.insertAdjacentHTML('beforeend', `<img src="${item.href}"/>`)
    })

    // if (gridWidth > containerWidth) {
    //   item.querySelector('.table-js-arrow--next').classList.add('is-active');
    // } else {
    //   item.querySelector('.table-js-arrow--next').classList.remove('is-active');
    // }
  }

  function checkArrowActive(table) {
    setTimeout(() => {
      const scrollMax = table.scrollWidth - table.clientWidth;;
      const next = table.parentNode.querySelector('.table-js-arrow--next');
      const nextUnderLay = table.parentNode.querySelector('.swiper-button__underlay--next');
      const prev = table.parentNode.querySelector('.table-js-arrow--prev');

      if (scrollMax === table.scrollLeft) {
        next.classList.remove('is-active');
        nextUnderLay.classList.remove('is-active');
      } else {
        next.classList.add('is-active');
        nextUnderLay.classList.add('is-active');
      }

      if (0 === table.scrollLeft) {
        prev.classList.remove('is-active');
      } else {
        prev.classList.add('is-active');
      }
    }, 500);
  }

  // window.addEventListener('DOMContentLoaded', () => {
  //   init();
  // });

  /**
   * Return immutable object.
   */
  return Object.freeze({
    init,
  });
};

window.buildGlobalUpsell = globalUpsell;

function globalUpsell() {
  upsellAjax().init();
}


/*--------------------------------------------------------------
  # Toggle Div Show/Hide
  --------------------------------------------------------------*/
function mobileMenu() {
  const trigger = document.querySelectorAll('.js-open-menu');
  const triggerClose = document.querySelectorAll('.js-close-menu');
  const menu = document.querySelector('.js-mobile-menu');
  const openSubMenu = document.querySelectorAll('.js-open-submenu');
  const closeSubMenu = document.querySelectorAll('.js-close-submenu');

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    trigger.forEach((item) => {
      item.addEventListener('click', function (event) {
        openMenu();
      });
    });

    triggerClose.forEach((item) => {
      item.addEventListener('click', function (event) {
        closeMenu();
      });
    });

    openSubMenu.forEach((item) => {
      item.addEventListener('click', function (event) {
        handleOpenSubMenu(item);
      });
    });

    closeSubMenu.forEach((item) => {
      item.addEventListener('click', function (event) {
        handleCloseSubMenu(item);
      });
    });
  }

  function openMenu() {
    menu.classList.add('is-open')
  }

  function closeMenu() {
    menu.classList.remove('is-open')
  }

  function handleOpenSubMenu(item) {
    console.log(item.dataset.mobile)
    const targetData = item.dataset.mobile;
    const targetMenu = document.querySelector(`.mobile-menu [data-mobile-id="${targetData}"]`)
    console.log(targetMenu);
    targetMenu.classList.add('is-open')
  }

  function handleCloseSubMenu(item) {
    const targetData = item.dataset.mobile;
    const targetMenu = document.querySelector(`.mobile-menu [data-mobile-id="${targetData}"]`)
    targetMenu.classList.remove('is-open')
  }

  function init() {
    setEventListeners();
  }

  return Object.freeze({
    init,
  });
}

mobileMenu().init();
