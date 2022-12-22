
function bundleBuilder() {
  const stages =  {
    stageOne: document.querySelector('[data-stage="one"]'),
    stageTwo: document.querySelector('[data-stage="two"]'),
    stageThee: document.querySelector('[data-stage="three"]'),
  }

  const selectors =  {
    container: document.querySelector('[data-products="container"]'),
    bundleSizeItems: document.querySelectorAll('[data-bundle-size="item"]'),
    bundleSizeString: document.querySelectorAll('[data-bundle-size="html"]'),
    productItems: document.querySelectorAll('[data-product="item"]'),
    miniCartContainer: document.querySelector('[data-mini-cart="container"]'),
    quickView: document.querySelector('[data-quick-view="container"]'),
    quickViewContent: document.querySelector('[data-quick-view="content"]'),
    quickViewOpen: document.querySelectorAll('[data-quick-view="open"]'),
    quickViewClose: document.querySelectorAll('[data-quick-view="close"]'),
    cartTotal: document.querySelector('[data-cart-total="container"]'),
    checkout: document.getElementById('bundle-checkout'),
    checkoutRC: document.getElementById('bundle-recharge'),
    checkoutView: document.getElementById('bundle-checkout-view'),
    checkoutViewHide: document.querySelector('[data-checkout-view="hide"]'),
    checkoutBundleCounter: document.querySelector('.bundle-counter'),
    bundleTwelve: document.querySelector('.bundle-size[data-size="12"]'),
    counter: document.querySelector('[data-counter="container"]'),
    counterRemoveContainer: document.querySelector('.bundle-counter-remove'),
    counterRemove: document.querySelector('[data-counter-remove="container"]'),

    triggerReCharge: document.querySelectorAll('[data-trigger="triggerReCharge"]'),
    rcQuickView: document.querySelector('[data-rc-view="container"]'),
    rcQuickViewContent: document.querySelector('[data-rc-view="content"]'),
    rcQuickViewOpen: document.querySelectorAll('[data-rc-view="open"]'),
    rcQuickViewClose: document.querySelectorAll('[data-rc-view="close"]'),
  }

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    selectors.bundleSizeItems.forEach((item) => {
      item.addEventListener('click', function (event) {
        setBundleSizeActive(item);
      });
    });

    selectors.quickViewOpen.forEach((item) => {
      item.addEventListener('click', function (event) {
        quickView(item)
      });
    })

    selectors.quickViewClose.forEach((item) => {
      item.addEventListener('click', function (event) {
        quickViewClose()
      });
    })

    selectors.rcQuickViewClose.forEach((item) => {
      item.addEventListener('click', function (event) {
        closeModalRC()
      });
    })

    selectors.checkoutView.addEventListener('click', function (event) {
      checkoutView()
    });

    selectors.checkoutViewHide.addEventListener('click', function (event) {
      checkoutViewHide()
    });

    document.documentElement.addEventListener('keydown', handleKeydown);

    if (selectors.checkout) {
      selectors.checkout.addEventListener('click', handleCheckout);
    }

    document.addEventListener('click', function (event) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the element that we care about. The element that was clicked on is made available at "e.target"
      const element = event.target;

      // Check if it matches our previously defined selector
      if (element.matches(selectors.remove)) {
        handleRemoveFromCart(event);
      }

      if (element.matches(nodeSelectors.increment) || element.matches(nodeSelectors.decrement)) {
        handleQuantity(element)
      }

    });
  }

  /**
   * This is mapping and return all active products in the cart
   */
  function products(type) {
    var mapType = selectors.productItems

    if (type == 'side') {
      mapType = document.querySelectorAll('[data-mini-cart="container"] [data-product="item"]');

      setTimeout(() => {
        matchInput(mapType);
      }, 200);
    }

    var bundleItems = {}

    mapType.forEach((item, index) => {
      const productThumbnail = item.dataset.productThumbnail;
      const productHandle = item.dataset.productHandle;
      const productId = item.dataset.productId;
      const product24Id = item.dataset.productIdLarge;
      const productTitle = item.dataset.productTitle;
      const productCount = parseInt(item.dataset.productCount);
      const itemIndex = index + 1;

      bundleItems['product-'+itemIndex ] = {
        'thumbnail': productThumbnail,
        'id': productId,
        'id24': product24Id,
        'handle': productHandle,
        'title': productTitle,
        'count': productCount
      };
    });

    return bundleItems;
  }

  /**
   * This is the constructor function fo the side cart
   */
  function buildSideCart(mapType) {
    const cartTemplate = getCartTemplate(mapType);

    if(selectors.miniCartContainer) {
      selectors.miniCartContainer.innerHTML = cartTemplate;

      keepTheCount();
    }
  }

  /**
   * This maps all products in the cart
   * Then returns everything as HTML the HTML
   */
  function getCartTemplate(mapType) {
    var getProducts = products(mapType);
    var productObj = Object.keys(getProducts);

    const lineItemsTemplate = productObj
      .map((item) => getLineItemTemplate(getProducts[item]))
      .join('');

    return `${lineItemsTemplate}`;
  }

  /**
   * Build HTML for each line item in the cart
   */
  function getLineItemTemplate(item) {
    const thumbnail = item.thumbnail;
    const title = item.title;
    const handle = item.handle;
    const count = item.count;
    const id = item.id;
    const id24 = item.id24;

    if (count == '0' || count == 0) {return}

    const cartRow = `
        <div
          class="bundle-cart__item"
          data-product="item"
          data-product-title="${title}"
          data-product-id="${id}"
          data-product-id-large="${id24}"
          data-product-handle="${handle}"
          data-product-count="${count}"
          data-product-thumbnail="${thumbnail}"
        >
          <img style="display: none" src="${thumbnail}" alt="${title}"/>
          <h5>${title}</h5>

          <div class="quantity-selector">
            <div js-quantity-selector="decrement" data-type="side" class="quantity-selector__control quantity-selector__control--minus">-</div>
            <input type="number" min="0" js-quantity-selector="input" class="quantity-selector__count" value="${count}"/>
            <div js-quantity-selector="increment" data-type="side" class="quantity-selector__control quantity-selector__control--plus">+</div>
          </div>
        </div>`;

    return cartRow;
  }

  /**
   * Update the dataset productCount to match input
   */
  function handleQuantity(element) {
    const mapType = element.dataset.type;

    setTimeout(() => {
      const input = element.parentNode.querySelector("[js-quantity-selector='input']");
      const inputValue = parseInt(input.value);
      element.parentNode.parentNode.dataset.productCount = inputValue;

      buildSideCart(mapType);
      logEverything();
    }, 100);
  }

  /**
   * When updating the count in the side cart this will also update the main bundle
   */
  function matchInput(items) {
    items.forEach((item) => {
      const handle = item.dataset.productHandle;
      const count = parseInt(item.dataset.productCount);
      const matchItem = document.querySelector(`[data-product-handle="${handle}"]`)
      const matchInput = matchItem.querySelector(`input`)
      matchInput.value = count;
      matchItem.dataset.productCount = count;
    });
  }

    /**
   * This function will calculate and limit the number of meals in the cart
   * This will disable and enable quantity selectors
   * The count message will also be updated on change
   */
  function keepTheCount() {
    const sideCartItems = document.querySelectorAll('[data-mini-cart="container"] [data-product="item"]');
    const maxItems = getMaxItems();
    var counter = 0;

    sideCartItems.forEach((item) => {
      const itemCount = parseInt(item.dataset.productCount);
      counter = counter + itemCount;
    });

    addNumberOfMeals(maxItems, counter)
    sizeTwelveRestrict(maxItems, counter)

    if (counter >= maxItems) {
      disableAdds()
    } else {
      enableAdds()
    }

    setMobileCartHeight();
  }

  /**
   *  Update the number of items you need to add to the cart to checkout
   * @param {Int} maxItems - Selected bundle size 12 or 24
   * @param {Int} cartCounter - Number of items in the cart
   */
  function addNumberOfMeals(maxItems, cartCounter) {
    const countToAdd = maxItems - cartCounter;
    selectors.counter.innerHTML = countToAdd;
  }

  /**
   *  Restrict size bundle 12 if more than 12
   * @param {Int} maxItems - Selected bundle size 12 or 24
   * @param {Int} cartCounter - Number of items in the cart
   */
  function sizeTwelveRestrict(maxItems, cartCounter) {
    if (maxItems == 24 && cartCounter > 12) {
      const countToRemove = cartCounter - 12;
      selectors.counterRemove.innerHTML = countToRemove;
      selectors.counterRemoveContainer.classList.add('is-active');
      selectors.bundleTwelve.classList.add('is-disabled');
    } else {
      selectors.counterRemoveContainer.classList.remove('is-active');
      selectors.bundleTwelve.classList.remove('is-disabled');
    }
  }

  /**
   *  Set Bundle Size to active the update the active count
   * @param {HTML} item - This is active/clicked meal size
   */
  function setBundleSizeActive(item) {
    const currentBundleSize = parseInt(item.dataset.size);
    const total = item.dataset.price;

    selectors.bundleSizeItems.forEach((element) => {
      element.classList.remove('is-active');
    });

    item.classList.add('is-active');
    updateMealSizes(currentBundleSize);
    updateTotal(total)
    keepTheCount();
  }

  /**
   *  Update the bundle size HTML elements
   *  @param {Int} currentBundleSize - Current active bundle size
   */
  function updateMealSizes(currentBundleSize) {
    selectors.bundleSizeString.forEach(element => {
      element.innerHTML = `${currentBundleSize} meals`;
    });
  }


  /**
   *  Return the number of items currently in the mini cart
   */
  function getMaxItems() {
    var maxItems = 12;
    selectors.bundleSizeItems.forEach((element) => {
      if (element.classList.contains('is-active')) {
        maxItems = parseInt(element.dataset.size);
      }
    });

    return maxItems;
  }

  /**
   * Disable all increment code for quantity selectors
   */
  function disableAdds() {
    const itemIncrement = document.querySelectorAll('[js-quantity-selector="increment"]');

    itemIncrement.forEach((element) => {
      element.classList.add('is-disabled');
    })

    selectors.checkout.classList.remove('is-disabled');
    selectors.checkoutRC.classList.remove('is-disabled');
    selectors.checkoutBundleCounter.classList.remove('is-active');
  }

  /**
   *  Enable all increment code for quantity selectors
   */
  function enableAdds() {
    const itemIncrement = document.querySelectorAll('[js-quantity-selector="increment"]');

    itemIncrement.forEach((element) => {
      element.classList.remove('is-disabled');
    })

    selectors.checkout.classList.add('is-disabled')
    selectors.checkoutRC.classList.add('is-disabled')
    selectors.checkoutBundleCounter.classList.add('is-active');
  }

  /**
   *  Quick View - Opens the modal
   * Then calls the product description via Ajax
   * @param {HTML} element - This is the element the has the view quick data attr
   */
  function quickView(element) {
    const quickViewHandle = element.dataset.quickViewHandle;
    const productHandle = getProductUrl(quickViewHandle);
    quickViewClean();
    quickViewOpen();

    $.ajax({
      url: productHandle,
      context: document.body
    }).done(function(data) {
      selectors.quickViewContent.innerHTML = data;

      setTimeout(() => {
        $(".quick-view__gallery-slider").flickity({
          // options
          // cellAlign: "left",
          // contain: true,
        });
      }, 100);
    });
  }

  /**
   * Open the quick modal
   */
  function quickViewOpen() {
    selectors.quickView.classList.add('is-active');
  }

  /**
   *  Close the quick view modal
   */
  function quickViewClose() {
    selectors.quickView.classList.remove('is-active');
  }

  /**
   * Remove all HTML from modal
   */
  function quickViewClean() {
    selectors.quickViewContent.innerHTML = '';
  }

  /**
   * If key press is ESC close modal.
   */
  function handleKeydown(event) {
    if (event.keyCode === 27) {
      quickViewClose();
      closeModalRC();
    }
  }


  /**
  * Get quick view product template url.
  * @param {String} handle - The product handle to quick view.
  */
  function getProductUrl(handle) {
    return `/products/${handle}?view=quick-view`;
  }

  /**
   *  Update MiniCart Total Price
   * @param {String} total - This is what the cart total will be updated too
   */
  function updateTotal(total) {
    selectors.cartTotal.innerHTML = total;
  }

  function returnProductVar(productId, productIdLarge, boxSize) {
    var variantSize = '';

    if (boxSize === 24) {
      variantSize = productIdLarge;
    } else if (boxSize === 12) {
      variantSize = productId;
    }
    return parseInt(variantSize);
  }

  function handleCheckout() {
    // const productId = parseInt(document.querySelector('.bundle-size.is-active').dataset.variant);
    const sideCartItems = document.querySelectorAll('[data-mini-cart="container"] [data-product="item"]');
    const shippingInterval = document.querySelector('[data-frequency="container"]').value;
    const boxSize = parseInt(document.querySelector('.bundle-size.is-active').dataset.size);

    var items = [];
    const boxID = getRandomInt();

    sideCartItems.forEach((item, index) => {
      const productId = item.dataset.productId;
      const productIdLarge = item.dataset.productIdLarge;
      const productCount = parseInt(item.dataset.productCount);

      const getProductVar = returnProductVar(productId, productIdLarge, boxSize);

      const itemTemp = {
        'id': getProductVar,
        'quantity': productCount,
        "properties": {
          "box_id": boxID,
          "subscription_id": 'bundle_box',
          "shipping_interval_unit_type": "week",
          "shipping_interval_frequency": shippingInterval
        }
      }

      items.push(itemTemp)
    });

    const formData = {
      items
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      window.location.href = "/cart";
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return sideCartItems;
  }

  function handleCheckoutOld() {
    const productId = parseInt(document.querySelector('.bundle-size.is-active').dataset.variant);
    const sideCartItems = document.querySelectorAll('[data-mini-cart="container"] [data-product="item"]');
    const shippingInterval = document.querySelector('[data-frequency="container"]').value;

    var properties = {
      subscription_id: "299769",
      shipping_interval_unit_type: "week",
      shipping_interval_frequency: shippingInterval
    }

    sideCartItems.forEach((item, index) => {
      const productHandle = item.dataset.productHandle;
      const productCount = parseInt(item.dataset.productCount);
      const productThumbnail = item.dataset.productThumbnail;

      properties[`product-handle-${productHandle}`] = productCount;
      properties[`product-thumbnail-${productHandle}`] = productThumbnail;
    });

    const data = {
      "id": productId,
      "quantity": 1,
      properties
    }

    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
      dataType: 'json',
      success: function() {
        window.location.href = "/cart";
      }
    });

    return sideCartItems;
  }

  function getRandomInt() {
    var date = new Date();
    var dateTime = date.getDate() + date.getTime();
    var randomNumber = Math.floor(Math.random() * 6);
    var dateAndRandomNumber = dateTime + randomNumber;
    return dateAndRandomNumber;
  }

  /**
 * Testing purposes: This is just logging everything to check the updates
 */
  function logEverything() {
    return;
    console.log('All Stage: Logged 👇👇');
    console.log(stages)

    console.log('Products Array: Logged 👇👇👇');
    console.log(products());
  }

  function fetchBundle(props) {
    const dataAttr = props.dataset.bundle;
    const targetJson = $(`[data-product-json="${dataAttr}"]`)
    const htmlJson = targetJson.html();
    const bundleJson = JSON.parse(htmlJson);

    $.ajax({
      url: 'https://mamamadefood.com/pages/build-a-box',
      context: document.body
    }).done(function(data) {
      const dataHTML = $(data).find('.bundle-wrapper');
      openModalRC(dataHTML, targetJson, dataAttr)
      window.bundleBuilder().init();
      window.bundleBuilder().setQuantities(bundleJson);
      window.bundleBuilder().setBundleSize(bundleJson);
      window.bundleBuilder().setIntervalFrequency(bundleJson);
    });
  }

  function openModalRC(dataHTML, targetJson, dataAttr) {
    selectors.rcQuickView.classList.add('is-active');
    $('[data-rc-view="content"]').html(dataHTML);
    $('[data-rc-view="content"]').find('#bundle-recharge').attr('data-box-id', dataAttr)

    // TODO: This is a hack to get the product json to the modal
    const activeJson = targetJson.attr('id', 'product-json');;
    $('[data-rc-view="content"]').after(activeJson);
  }

  function closeModalRC() {
    selectors.rcQuickView.classList.remove('is-active');
  }

  function setQuantities(buildABoxContainer) {
    buildABoxContainer.map(function (bundle, index) {
      const handle = bundle.item.product.shopify_details.handle;
      const count = bundle.item.quantity;
      const targetProduct = document.querySelector(`[data-product-handle="${handle}"]`);
      const targetProductInput = targetProduct.querySelector(`.quantity-selector__count`);

      console.log('targetProduct', targetProduct);
      targetProduct.classList.add('bundle-item--is-active');
      targetProduct.dataset.productCount = count;
      targetProductInput.value = count;
    });

    buildSideCart();
  }

  function setBundleSize(buildABoxContainer) {
    const bundleSizeTarget = buildABoxContainer[0].item.variant_title;
    if (bundleSizeTarget === 'meal [24]') {
      document.querySelector('.bundle-size[data-size="24"]').click();
    } else {
      document.querySelector('.bundle-size[data-size="12"]').click();
    }
  }

  function setIntervalFrequency(buildABoxContainer) {
    const bundleSizeTarget = buildABoxContainer[0].item.charge_interval_frequency;

    const select = document.querySelector('[data-frequency="container"]');
    select.value = bundleSizeTarget;
  }

  function checkoutView() {
    const rcModalClose = document.querySelector('[data-rc-view="close"]');
    document.querySelector('.bundle-cart-container').classList.add('is-active');

    setMobileCartHeight();

    if(rcModalClose) {
      document.querySelector('.rc-modal__close').classList.add('is-hidden');
    }
  }

  function checkoutViewHide() {
    const rcModalClose = document.querySelector('[data-rc-view="close"]');

    document.querySelector('.bundle-cart-container').classList.remove('is-active');

    if(rcModalClose) {
      document.querySelector('.rc-modal__close').classList.remove('is-hidden');
    }

    const cart = document.querySelector('.bundle-cart');


    if (!cart) {return;}

    cart.style.height = `auto`;
  }

  function setMobileCartHeight() {
    const docWidth = window.innerWidth;

    if (docWidth >= 990) {
      return;
    }

    const docHeight = window.innerHeight;
    const cart = document.querySelector('.bundle-cart-container.is-active .bundle-cart');

    if (!cart) {return;}

    const cartHeader = document.querySelector('.bundle-cart__header');
    const cartProductContainer = document.querySelector('.bundle-cart__contianer');
    const cartDetails = document.querySelector('.bundle-cart__details');
    const bundleMessage = document.querySelector('.bundle-counter')

    const cartHeaderHeight = cartHeader.offsetHeight;
    const cartDetailsHeight = cartDetails.offsetHeight;
    const bundleMessageHeight = bundleMessage.offsetHeight;
    const newCartContainerHeight = docHeight - cartHeaderHeight - cartDetailsHeight - bundleMessageHeight;

    cart.style.height = `calc(100vh - ${bundleMessageHeight}px)`;
    cartProductContainer.style.height = `${newCartContainerHeight}px`;
  }

  function checkHistory() {
    const location = document.location.pathname;

    if (location === '/pages/build-a-box') {
      const quantityInput = document.querySelectorAll('[js-quantity-selector="input"]');

      setTimeout(() => {
        quantityInput.forEach((element) => {;
          element.value = '0';
        })
      }, 100);
    }
  }

  function fetchCalender(props) {
    console.log(props);
    const dataAttr = props.dataset.bundle;
    const targetJson = $(`[data-product-json="${dataAttr}"]`)
    const htmlJson = targetJson.html();
    const bundleJson = JSON.parse(htmlJson);
    console.log(bundleJson);

  }

  function init() {
    checkHistory();
    setEventListeners();
    logEverything();
    products();
    buildSideCart();
  }

  return Object.freeze({
    init,
    fetchBundle,
    setQuantities,
    setBundleSize,
    setIntervalFrequency,
    fetchCalender,
  });
}

window.bundleBuilder();
