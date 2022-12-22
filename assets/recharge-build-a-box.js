function rechargeBundleBuilder() {
  const stages = {
    stageOne: document.querySelector('[data-stage="one"]'),
  };

  const selectors = {
    container: document.querySelector('[data-recharge-bundle="container"]'),
    checkoutRC: document.getElementById("bundle-recharge"),
  };

  const nodeSelectors = {
    updateBundle: "bundle-recharge",
    cancel: "[data-trigger='cancel']",
  };

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    document.addEventListener("click", function (event) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the element that we care about. The element that was clicked on is made available at "e.target"
      const element = event.target;

      // If update bundle is clicked
      if (element.id == nodeSelectors.updateBundle) {
        handleCheckoutRC(element);
      }

      if (element.hasAttribute('data-trigger-cancel')) {
        handleCancel(element);
      }

      if (element.classList.contains('helper')) {
        if (element.classList.contains('is-active')) {
          element.classList.remove('is-active');
        } else {
          triggerTooltip(element)
        }
      }
    });

    getAllSubscriptions();
  }

  /**
   * Get all active subscriptions for a customer via ReCharge AJAX call
   */
  function getAllSubscriptions() {
    if (!window.addresses) {
      return;
    }

    const url = `https://mamamadefood.com/tools/recurring/portal/${window.customerHash}/request_objects?token=${window.customerToken}`;

    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      data: {
        schema:
          '{ "charges": [], "orders": [], "subscriptions": { "product": {} }, "schedule": [], "customer": {}, "settings": {}, "store": {} }',
      },
    })
      .done(function (response) {
        // Successful request made
        // console.log('Successful request made');
        // console.log(response);
        mapBundles(response);
      })
      .fail(function (response) {
        // Request failed
        if (selectors.container) {
          selectors.container.classList.add('is-hidden');
        }
        console.log("🟥");
        console.log(response);
      });
  }

  /**
   *  Map all subscription that have a boxId and are not 'CANCELLED'
   * @param {Object} response - All data return from getAllSubscriptions() AJAX call. This has all active subscriptions
   */
  function mapBundles(response) {
    const subscriptions = response.subscriptions;
    const schedule = response.schedule;
    var bundles = [];
    var boxIds = [];
    subscriptions.map(function (item, index) {
      const boxId = returnBoxIds(item.properties);
      if (item.status != "CANCELLED" && boxId != "") {
        var bundleItem = { item: item, itemCount: index, boxId: boxId };
        bundles.push(bundleItem);
        boxIds.push(boxId);
      }
    });

    if (bundles.length === 0) {
      selectors.container.classList.add('is-hidden');
    } else {
      splitBoxes(boxIds, bundles, schedule);
    }
  }

  /**
   *  Return the Box ID for a subscription
   * @param {Object} props - All properties for a subscription
   */
  function returnBoxIds(props) {
    var tempProp = "";
    props.map(function (prop, index) {
      if (prop.hasOwnProperty("name") && prop.name == ["box_id"]) {
        buildABox = true;
        hasBuildABox = true;
        tempProp = prop.value;
      }
    });
    return tempProp;
  }

  /**
   * Split subscriptions into boxes based on their Box ID
   * @param {Array} boxIds - An array af all box ids found on Active subscriptions
   * @param {Object} bundles - All active subscriptions with a Box ID   */
  function splitBoxes(boxIds, bundles, schedule) {
    const uniqueArray = boxIds.filter(function (item, pos) {
      return boxIds.indexOf(item) == pos;
    });

    uniqueArray.map(function (boxId) {
      var buildABoxContainer = [];
      bundles.map(function (bundle) {
        if (bundle.boxId == boxId) {
          buildABoxContainer.push(bundle);
        }
      });
      createBoxesHTML(buildABoxContainer, boxId, schedule);

    });
    // TODO: Move init function to here
    window.rechargeCalendar().setEventListeners();
  }

  /**
   * Generate HTML for images
   * Initiate flickity slider
   * @param {Object} buildABoxContainer - This contains all of the products and its data
   */
  function createBoxesHTML(buildABoxContainer, boxId, schedule) {
    // console.log(buildABoxContainer);

    const images = returnImages(buildABoxContainer);
    const bundleHtml = returnHTML(buildABoxContainer, images);

    $(selectors.container).addClass('is-hidden');
    $(selectors.container).after(bundleHtml);
    $(".rc-image-slider").flickity({
      // options
      cellAlign: "left",
      contain: true,
    });

    window.rechargeCalendar().init(boxId, schedule);
  }

  /**
   * This generates and returns the HTML for Build a Box images
   * @param {Object} buildABoxContainer - This contains all of the products its data
  */
  function returnImages(buildABoxContainer) {
    var images = "";
    buildABoxContainer.map(function (bundle, index) {
      var image = bundle.item.product.shopify_details.image.src;
      images =
        images +
        `<div class="rc-image-slider__slide"><div class="rc-image-slider__image" style="background-image: url('${image}')"></div></div>`;
    });
    return images;
  }

  /**
   * Map the bundle and calculate the total quantity.
   * @param {Object} buildABoxContainer - This contains all of the products its data
   */
  function returnQuantity(buildABoxContainer) {
    var quantity = 0;
    buildABoxContainer.map(function (bundle, index) {
      quantity = quantity + bundle.item.quantity;
    });
    return quantity;
  }

  /**
   * This generates and returns the HTML for all Build a Box subscriptions
   * @param {Object} buildABoxContainer - This contains all of the products its data
   * @param {HTML} images - This is the images for build a box
   */
  function returnHTML(buildABoxContainer, images) {
    const boxId = buildABoxContainer[0].boxId;
    const date = buildABoxContainer[0].item.next_charge_scheduled_at;
    const interval = buildABoxContainer[0].item.order_interval_frequency;
    const price = returnPrice(buildABoxContainer[0]);
    const quantity = returnQuantity(buildABoxContainer);
    var options = { weekday: "long", month: "long", day: "numeric" };
    var returnDate = new Date(date);
    var cleanDate = returnDate.toLocaleDateString("en-EN", options);
    var dateDay = moment(date).format('D');
    var dateMonth = moment(date).format('MMMM');

    const html = `<div class="rc-active-order rc-active-order--main">
                    <script type="application/json" data-product-json="${boxId}">
                      ${JSON.stringify(buildABoxContainer)}
                    </script>
                    <div data-product="" class="rc-active-order__item rc-content Build-a-Box" data-container="${boxId}">
                      <div class="recharge__active-order__image-container">
                        <div>
                          <div class="recharge__active-order__image" style="background-image: url(https://cdn.shopify.com/s/files/1/0501/4588/6360/products/kohlrabi-web_large.png?v=1639087968)">
                          </div>
                        </div>
                      </div>

                      <div class="recharge__active-order__title recharge__active-order__title--small">
                        <div>
                          <h3>
                            Build a Box
                          </h3>
                        </div>
                      </div>

                      <div class="recharge__active-order__details">
                        <div class="recharge__active-order__title">
                          <div>
                            <h3>
                              Build a Box
                            </h3>
                          </div>
                        </div>

                        <div class="recharge__active-order__info">
                          <div class="recharge__active-order__col">
                            <p class="recharge__active-order__shipping">Next Order Ships <span class="helper">? <span class="helper__text">This refers to the shipping date of your next order. If you have just placed an order, your box will usually arrive on the nearest Tuesday or Friday to your order date.</span></span></p>
                            <p>${cleanDate}</p>
                          </div>

                          <div class="recharge__active-order__col">
                            <p>Delivery Every</p>
                            <p>${interval} Weeks</p>
                          </div>

                          <div class="recharge__active-order__col">
                            <p>Quantity</p>
                            <p>${quantity} Meals</p>
                          </div>

                          <div class="recharge__active-order__col">
                            <p>Price</p>
                            <p>${price}</p>
                          </div>
                        </div>
                      </div>

                      <div class="rc__active-order__button" >
                        <div class="Button Button__large Button--secondary" data-trigger="bundle-load" data-bundle="${boxId}">
                          Edit Bundle
                        </div>

                        <div class="Button Button__large Button--secondary" data-trigger-schedule="schedule-load" data-box-id="${boxId}">
                          Reschedule
                        </div>
                      </div>

                      <div class="recharge-calendar__container recharge-calendar__container--${boxId}">
                        <div class="recharge-calendar" data-calendar="${boxId}">
                          <div class="recharge-calendar__header">
                            <li>S</li>
                            <li>M</li>
                            <li>T</li>
                            <li>W</li>
                            <li>T</li>
                            <li>F</li>
                            <li>S</li>
                          </div>

                          <div class="recharge-calendar__body" data-container="calendar">
                          </div>
                        </div>

                        <div class="recharge__schedule-info">
                          <div class="recharge__schedule-info__text">
                            <div>
                              <h4>Schedule</h4>
                              <p>Your next Build a Box is scheduled to leave the kitchen on ${cleanDate}.</br>Orders are delivered on Tuesdays and Fridays.</p>
                            </div>

                            <div class="recharge__mini-date">
                              <div class="recharge__mini-date__date">
                                ${dateDay}
                              </div>
                              <div class="recharge__mini-date__month">
                                ${dateMonth}
                              </div>
                            </div>
                          </div>

                          <div class="recharge__schedule-info__buttons">
                            <div class="Button Button__large Button--secondary recharge__skip-delivery is-disabled" data-box-id="${boxId}" data-charge-id>
                              Reschedule Delivery
                            </div>

                            <div class="Button Button__large Button--secondary" style="display: none" data-trigger-cancel="cancel" data-box-id="${boxId}">
                              Cancel Order
                            </div>

                          </div>
                        </div>

                        <div class="recharge__schedule-info__message recharge__schedule-info__message--${boxId} mini-cart-message">
                          Message goes here
                        </div>

                        <p class="recharge__schedule-info__cancel-message">Please contact <a href="mailto:care@mamamadefood.com" class="link-underline">care@mamamadefood.com</a> to cancel</p>

                      </div>

                      <div class="rc-image-slider-container">
                        <div class="rc-image-slider-title">
                          What's in my bundle?
                        </div>

                        <div class="rc-image-slider">
                          ${images}
                        </div>
                      </div>
                    </div>
                  </div>`;

    return html;
  }

  function returnPrice(bundleItem) {
    var price = bundleItem.item.price;

    if (price == 2.5) {
      return "£2.50 per meal";
    } else {
      return `£${price} per meal`;
    }
  }


  // TODO: This needs some nice UI stuff
  function handleCancel(element) {
    const boxId = element.dataset.boxId;
    const targetJson = $(`[data-product-json="${boxId}"]`);
    const htmlJson = targetJson.html();
    const bundleJson = JSON.parse(htmlJson);
    const address = bundleJson[0].item.address_id;
    var items = [];

    bundleJson.forEach((item) => {
      const subscriptionId = item.item.id;

      const itemTemp = {
        "id": subscriptionId,
        "status": "CANCELLED",
        "cancellation_reason": "other_reason",
        "cancellation_reason_comments": "Build a Box Cancel",
      }

      items.push(itemTemp)
    });

    let dataToSend = {
      "subscriptions": items
    }

    let url = `https://mamamadefood.com/tools/recurring/portal/${window.customerHash}/addresses/${address}/subscriptions-bulk-update?token=${window.customerToken}`;

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(dataToSend),
      beforeSend: function() {
        // handleLoadingState();
        // TODO: handle loading state
      },
      success: function(response) {
        // TODO: handle success state
        console.log(response);
      },
      error: function(response) {
        // TODO: handle error state
        // Request failed
        // handleErrorState()
        console.log(response.responseText);
        console.log('🟥')
      }
    });
  }

  /**
   * This handle the Recharge checkout/update process
   * This removes all product from this bundle/subscription address
   */
  function handleCheckoutRC(element) {
    const boxId = element.dataset.boxId;
    const targetJson = $(`[data-product-json="${boxId}"]`);
    const htmlJson = targetJson.html();
    const bundleJson = JSON.parse(htmlJson);
    const address = bundleJson[0].item.address_id;
    const nextCharge = bundleJson[0].item.next_charge_scheduled_at;
    var items = [];

    bundleJson.forEach((item) => {
      const subscriptionId = item.item.id;

      const itemTemp = {
        "id": subscriptionId,
        "status": "CANCELLED",
        "cancellation_reason": "other_reason",
        "cancellation_reason_comments": "Build a Box Switch",
      }

      items.push(itemTemp)
    });

    let dataToSend = {
      "subscriptions": items
    }

    let url = `https://mamamadefood.com/tools/recurring/portal/${window.customerHash}/addresses/${address}/subscriptions-bulk-update?token=${window.customerToken}`;

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(dataToSend),
      beforeSend: function() {
        handleLoadingState();
      },
      success: function(response) {
        bulkCreate(address, nextCharge);
      },
      error: function(response) {
        // Request failed
        handleErrorState()
        console.log(response.responseText);
        console.log('🟥')
      }
    });
  }

  /**
   * Return the correct product variant
   * This will either be for 12 or 24 meals
   * @param {Int} productId - variant id for 12 meals
   * @param {Int} productIdLarge - variant id for 24 meals
   * @param {Int} boxSize - the size of the box/bundle that is being created
   */
  function returnProductVar(productId, productIdLarge, boxSize) {
    var variantSize = '';

    if (boxSize === 24) {
      variantSize = productIdLarge;
    } else if (boxSize === 12) {
      variantSize = productId;
    }
    return parseInt(variantSize);
  }

  /**
   * This creates a new bulk subscription
   * @param {Int} address - This defines the subscription that is being updated
   * @param {String} nextCharge - This defines the next charge date
   */
  function bulkCreate(address, nextCharge) {
    const sideCartItems = document.querySelectorAll('[data-mini-cart="container"] [data-product="item"]');
    const shippingInterval = document.querySelector('[data-frequency="container"]').value;
    const boxSize = parseInt(document.querySelector('.bundle-size.is-active').dataset.size);

    var items = [];
    const boxID = getRandomInt();

    sideCartItems.forEach((item) => {
      const productId = item.dataset.productId;
      const productIdLarge = item.dataset.productIdLarge;
      const productCount = parseInt(item.dataset.productCount);

      const getProductVar = returnProductVar(productId, productIdLarge, boxSize);

      const itemTemp = {
        "charge_interval_frequency": shippingInterval,
        "next_charge_scheduled_at": nextCharge,
        "order_interval_frequency": shippingInterval,
        "order_interval_unit": "week",
        "quantity": productCount,
        "shopify_variant_id": getProductVar,
        "properties": [
          {
            "name": "box_id",
            "value": boxID
          }
        ],
      }

      items.push(itemTemp)
    });

    let dataToSend = {
      "subscriptions": items
    }

    let url = `https://mamamadefood.com/tools/recurring/portal/${window.customerHash}/addresses/${address}/subscriptions-bulk-create?token=${window.customerToken}`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        beforeSend: function() {
          handleLoadingStateStageTwo();
        },
        success: function(e) {
          handleSuccessState()
        },
        complete: function() {
          handleCompleteState();
        },
        error: function(response) {
          // Request failed
          handleErrorState()
          console.log(response.responseText);
          console.log('🟥')
        }
      })

    return;
  }

  /**
   * Updates the UI to show the loading state (Stage One)
   * This is the messaging for removing all products
   */
  function handleLoadingState() {
    const button = document.getElementById("bundle-recharge");
    const message = document.querySelector('.recharge-message');

    button.classList.add('is-disabled');
    message.innerHTML = 'Building your Box... </br> Please do not refresh the page.';
    message.classList.add('is-active');
  }

  /**
   *  Updates the UI to show the loading state
   *  This is the messaging for adding all new products
   */
  function handleLoadingStateStageTwo() {
    const message = document.querySelector('.recharge-message');
    message.innerHTML = 'Please do not refresh the page. </br> We are Still Building your Box.';
  }

  /**
   * This is the completed state
   */
  function handleCompleteState() {
    const button = document.getElementById("bundle-recharge");

    button.classList.add('is-hidden');
  }

  /**
   * This function handles the success state
   */
  function handleSuccessState() {
    const message = document.querySelector('.recharge-message');
    message.innerHTML = '👍 Your box has been created!';

    setTimeout(() => {
      location.reload();
    }, 1500)
  }

  /**
   * Handle Error State
   * Updates UI to display Error
   */
  function handleErrorState() {
    const message = document.querySelector('.recharge-message');
    message.innerHTML = '👎 Whoops! Something went wrong. Please contact care@mamamadefood.com.';
  }

  /**
   * Generates a random number
   * This is used to link all bundle products together
   */
  function getRandomInt() {
    var date = new Date();
    var dateTime = date.getDate() + date.getTime();
    var randomNumber = Math.floor(Math.random() * 6);
    var dateAndRandomNumber = dateTime + randomNumber;
    return dateAndRandomNumber;
  }

  /**
   *  Trigger tooltip on mobile
   */
  function triggerTooltip(target) {
    const tooltip = document.querySelectorAll('.helper');
    tooltip.forEach((item) => {
      item.classList.remove('is-active');
    });

    target.classList.add('is-active');
  }

  /**
   * Initialize the script
   */
  function init() {
    setEventListeners();
  }

  return Object.freeze({
    init,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  window.rechargeBundleBuilder().init();
});

// TODO: Skip this order
// This need to select or box_id and loop through all of them
// TODO: Cancel my subscriptions
// This need to select or box_id and loop through all of them
// TODO: Update the Ships to address
// This need to select or box_id and loop through all of them
// TODO: Update the card on file
// This need to select or box_id and loop through all of them
