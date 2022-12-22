/*! Mamamade v1.0.0 | (c) 2021 Tom Greenhill | MIT License | https://github.com/Charle-Team/mamamade */
(function () {
  'use strict';

  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
    }
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */

  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument); // Clone the date

    if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

        console.warn(new Error().stack);
      }

      return new Date(NaN);
    }
  }

  /**
   * @name compareAsc
   * @category Common Helpers
   * @summary Compare the two dates and return -1, 0 or 1.
   *
   * @description
   * Compare the two dates and return 1 if the first date is after the second,
   * -1 if the first date is before the second or 0 if dates are equal.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the first date to compare
   * @param {Date|Number} dateRight - the second date to compare
   * @returns {Number} the result of the comparison
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Compare 11 February 1987 and 10 July 1989:
   * var result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
   * //=> -1
   *
   * @example
   * // Sort the array of dates:
   * var result = [
   *   new Date(1995, 6, 2),
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * ].sort(compareAsc)
   * //=> [
   * //   Wed Feb 11 1987 00:00:00,
   * //   Mon Jul 10 1989 00:00:00,
   * //   Sun Jul 02 1995 00:00:00
   * // ]
   */

  function compareAsc(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var diff = dateLeft.getTime() - dateRight.getTime();

    if (diff < 0) {
      return -1;
    } else if (diff > 0) {
      return 1; // Return 0 if diff is 0; return NaN if diff is NaN
    } else {
      return diff;
    }
  }

  /**
   * @name differenceInCalendarMonths
   * @category Month Helpers
   * @summary Get the number of calendar months between the given dates.
   *
   * @description
   * Get the number of calendar months between the given dates.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar months
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many calendar months are between 31 January 2014 and 1 September 2014?
   * var result = differenceInCalendarMonths(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 0, 31)
   * )
   * //=> 8
   */

  function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
  }

  /**
   * @name differenceInMonths
   * @category Month Helpers
   * @summary Get the number of full months between the given dates.
   *
   * @description
   * Get the number of full months between the given dates.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of full months
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many full months are between 31 January 2014 and 1 September 2014?
   * var result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
   * //=> 7
   */

  function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var sign = compareAsc(dateLeft, dateRight);
    var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
    dateLeft.setMonth(dateLeft.getMonth() - sign * difference); // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value

    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;
    var result = sign * (difference - isLastMonthNotFull); // Prevent negative zero

    return result === 0 ? 0 : result;
  }

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
  // find the complete implementation of crypto (msCrypto) on IE11.
  var getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }

    return getRandomValues(rnds8);
  }

  var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  function validate(uuid) {
    return typeof uuid === 'string' && REGEX.test(uuid);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */

  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
  }

  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0; // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434

    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields

    if (!validate(uuid)) {
      throw TypeError('Stringified UUID is invalid');
    }

    return uuid;
  }

  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }

      return buf;
    }

    return stringify(rnds);
  }

  var settings = {
    PROGRAMME_ID: 0,
    TIME_ANIMATION: 500,
    activeStage: 'info'
  };
  var cssSelectors = {
    charge: '[name="programme[charge_interval_frequency]"]',
    restart: '[data-restart]',
    loadMore: '[data-load]'
  };
  var selectors = {
    header: function header() {
      return $('#shopify-section-header');
    },
    progDiv: function progDiv() {
      return $('.ProgrammeScheme');
    },
    progCTA: function progCTA() {
      return $('.GroupCta .Button');
    },
    DOB: function DOB() {
      return $('[name="programme[birthday]"]');
    },
    name: function name() {
      return $('[name="programme[name]"]');
    },
    email: function email() {
      return $('[name="programme[email]"]');
    },
    food: function food() {
      return $('[name="programme[food]"]:checked');
    },
    milestone: function milestone() {
      return $('[name="programme[milestone]"]:checked');
    },
    charge: function charge() {
      return $(cssSelectors.charge);
    },
    chargeChecked: function chargeChecked() {
      return $("".concat(cssSelectors.charge, ":checked"));
    },
    chargeUnit: function chargeUnit() {
      return $('[name="programme[charge_interval_unit_type]"]');
    },
    requiredFields: function requiredFields() {
      return $('input[name^=programme][required]');
    },
    activeStage: function activeStage() {
      return $('.Stages__Stage.is-active');
    },
    stage: function stage(i) {
      return $(".ProgrammeStage--".concat(i));
    },
    stages: function stages() {
      return $('.ProgrammeStage:visible');
    },
    stagesBanner: function stagesBanner() {
      return $('.StagesBanner');
    },
    stagesIcons: function stagesIcons() {
      return $('.Stages__Stage');
    },
    stageIcon: function stageIcon(i) {
      return $("[data-programme-stage-0".concat(i, "]"));
    },
    products: function products() {
      return $('[name="programme[products]"]');
    },
    upsells: function upsells() {
      return $('[name="programme[upsells]"]');
    },
    addToCart: function addToCart() {
      return $('[data-stage="confirm"]');
    },
    signup: function signup() {
      return $('[name="programme[signup]"]');
    }
  };
  var utilities = {
    // Utility functions used throughout the rest of the build
    generateGuid: function generateGuid() {
      // Generates a unique guid to be used for the programme_id
      var GUID = v4();
      return settings.PROGRAMME_ID = GUID;
    },
    activeStage: function activeStage() {
      return selectors.stagesIcons().index(selectors.activeStage());
    },
    setActiveStage: function setActiveStage(stage) {
      selectors.activeStage().removeClass('is-active');
      selectors.stageIcon(stage).addClass('is-active');
    },
    setCompleteStage: function setCompleteStage(stage) {
      selectors.stageIcon(stage).addClass('is-complete');
    },
    showBanner: function showBanner() {
      selectors.stagesBanner().removeClass('is-inactive');
    },
    scroll: function scroll() {
      $([document.documentElement, document.body]).animate({
        scrollTop: selectors.progDiv().offset().top - selectors.header().outerHeight() - selectors.stagesBanner().outerHeight() * 2
      }, settings.TIME_ANIMATION);
    },
    loading: function loading(state) {
      document.dispatchEvent(new CustomEvent('theme:loading:' + state));
    },
    reveal: function reveal(results) {
      var $this = this;
      var toReveal = [];
      var timeline = new TimelineLite({
        delay: 0.5
      });
      results.forEach(function (result) {
        if (result.isIntersecting || result.intersectionRatio > 0) {
          // isIntersecting does not exist on Samsung Android browser
          toReveal.push(result.target);
          $this.intersectionObserver.unobserve(result.target);
        }
      });

      if (toReveal.length === 0) {
        return;
      }

      timeline.staggerFromTo(toReveal, 0.45, {
        autoAlpha: 0,
        y: 25
      }, {
        autoAlpha: 1,
        y: 0
      }, 0.2);
    },
    bringImagesIn: function bringImagesIn(stage) {
      setTimeout(function () {
        var featuredImage = $('.FeatureText--withImage img');
        lazySizes.loader.unveil(featuredImage[0]); // If there is already an observer set up, we remove it first

        if (stage.intersectionObserver) {
          stage.intersectionObserver.disconnect();
        }

        stage.intersectionObserver = new IntersectionObserver(utilities.reveal.bind(stage), {
          threshold: 0.3
        });
        // $('.ProductList .ProductItem').each(function (index, element) {
        //   stage.intersectionObserver.observe(element);
        // });
      }, settings.TIME_ANIMATION);
    },
    getName: function getName() {
      return selectors.name().val();
    },
    getDOB: function getDOB() {
      return selectors.DOB().val();
    },
    getEmail: function getEmail() {
      return selectors.email().val();
    },
    getFood: function getFood() {
      return +selectors.food().val();
    },
    getMilestone: function getMilestone() {
      return +selectors.milestone().val();
    },
    getCharge: function getCharge() {
      return +selectors.chargeChecked().val();
    },
    getChargeUnit: function getChargeUnit() {
      return selectors.chargeUnit().val();
    },
    // Returns the difference in months between now and the babys DOB
    checkDOB: function checkDOB() {
      var dob = new Date(utilities.getDOB());
      var now = new Date();
      return differenceInMonths(now, dob);
    },
    // What cycle should we place them on
    checkCycle: function checkCycle() {
      var points = utilities.scoreTotal();

      if (points >= 0 && points <= 5) {
        return 'first-tastes';
      } else if (points >= 6 && points <= 7) {
        return 'box-1a';
      } else if (points >= 8 && points <= 9) {
        return 'box-2a';
      } else if (points >= 10 && points <= 15) {
        return 'box-3a';
      } else if (points >= 16) {
        return 'box-4a';
      } else {
        console.error("The points scored (".concat(points, ") don't map to a cycle."));
      }
    },
    // Let's work out which cycle they need to join
    scoreDOB: function scoreDOB() {
      var months = utilities.checkDOB();

      if (months >= 0 && months < 4) {
        return 1;
      } else if (months >= 4 && months < 6) {
        return 2;
      } else if (months >= 6 && months < 9) {
        return 3;
      } else if (months >= 9 && months < 12) {
        return 4;
      } else if (months >= 12) {
        return 5;
      } else {
        console.error("There is an issue with the baby's age, ".concat(months));
      }
    },
    scoreTotal: function scoreTotal() {
      return utilities.scoreDOB() + utilities.getFood() + utilities.getMilestone();
    },
    getActiveStageDetails: function getActiveStageDetails() {
      var urlSegment;
      var stageNumber;
      var advance = true;
      var stage = settings.activeStage;

      switch (stage) {
        case 'info':
          advance = false;
          break;

        case 'products':
          urlSegment = utilities.checkCycle();
          stageNumber = 2;
          break;

        case 'upsell':
          urlSegment = stage;
          stageNumber = 3;
          break;

        default:
          throw new Error('Incorrect stage specified, please contact support.');
      }

      return {
        urlSegment: urlSegment,
        stageNumber: stageNumber,
        advance: advance
      };
    },
    listID: function listID() {
      var stage = utilities.checkCycle();

      switch (stage) {
        case 'box-1a':
          return 'SuvRL4';

        case 'box-2a':
          return 'XCuZhF';

        case 'box-3a':
          return 'RVhzr2';

        case 'box-4a':
          return 'V6Z4H2';

        default:
          return 'VdSzen';
      }
    },
    addUserToList: function addUserToList(listID) {
      try {
        return fetch('https://app.mamamadefood.com/.netlify/functions/server/add/list/' + listID, {
          body: JSON.stringify({
            'email': utilities.getEmail(),
            'birthday': utilities.getDOB(),
            'name': utilities.getName(),
            'food': utilities.getFood(),
            'milestone': utilities.getMilestone()
          }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header

          }
        }).then(function (response) {
          utilities.loading('end');
          var res = response.json();
          return res.email;
        });
      } catch (e) {
        console.error('There has been an error adding you to the mailing list.');
      }
    },
    go: {
      confirm: function confirm() {
        utilities.cart.processAddToCart();
      },
      stage: function stage(_stage) {
        utilities.loading('start');
        settings.activeStage = _stage;

        if (_stage === 'products' && selectors.signup().is(':checked')) {
          var listID = utilities.listID();
          console.log("🚀 ~ file: programme-scheme.js ~ line 223 ~ listID", listID);
          utilities.addUserToList('MTWRkG');
          utilities.addUserToList(listID);
        }

        var _utilities$getActiveS = utilities.getActiveStageDetails(),
            urlSegment = _utilities$getActiveS.urlSegment,
            stageNumber = _utilities$getActiveS.stageNumber,
            advance = _utilities$getActiveS.advance; // If we're moving to a stage that requires fetching of content


        if (advance) {
          var theStage = selectors.stage(stageNumber);
          var url = window.theme.collections + urlSegment;
          fetch(url, {
            credentials: 'same-origin',
            method: 'GET'
          }).then(function (response) {
            response.text().then(function (result) {
              utilities.loading('end');

              if (response.ok) {
                selectors.stages().hide();
                theStage.html(result).show();
                utilities.showBanner();
                utilities.setCompleteStage(stageNumber - 1);
                utilities.setActiveStage(stageNumber);
                utilities.scroll();
                utilities.bringImagesIn(theStage);
              }
            });
          }); // Else we're heading to the start
        } else {
          var _theStage = selectors.stage(1);

          selectors.stages().hide();
          selectors.stagesIcons().eq(1).removeClass('is-complete');

          _theStage.show();

          utilities.setActiveStage(1);
          utilities.scroll();
          utilities.loading('end');
        }
      }
    },
    mapStage: function mapStage(index) {
      switch (index) {
        case 0:
          return 'info';

        case 1:
          return 'products';

        case 2:
          return 'upsell';

        default:
          return 0;
      }
    },
    cart: {
      // getProducts: function() {
      //   const products = selectors.products()
      //     .map(function() {
      //       return $(this).val();
      //     })
      //     .get();
      //     return products;
      // },
      processAddToCart: function processAddToCart() {
        // Generate the product array to pass to AJAX call
        var items = utilities.cart.generateCart(); // Ensure there are items to add to cart, and if so, make
        // API call and redirect to /cart page

        if (items.length > 0) {
          utilities.cart.processToCart(items);
        } else {
          console.log('No items available to add to cart.');
        }
      },
      generateCart: function generateCart() {
        var cart = [];
        var programme_id = utilities.generateGuid();
        var subscription_id = $('#rc_subscription_id').val();
        var shipping_interval_frequency = $('#rc_shipping_interval_frequency').val();
        var shipping_interval_unit_type = $('#rc_shipping_interval_unit_type').val(); // If the are choosing not to prepay, sync with the shipping frequency

        var charge = utilities.getCharge();
        var isBundlePricing = charge > 0;
        var bundleIndex = selectors.charge().index(selectors.chargeChecked());
        var charge_interval_frequency = isBundlePricing ? charge : shipping_interval_frequency; // If the are choosing not to prepay, set to frequency

        var charge_interval_unit_type = isBundlePricing ? utilities.getChargeUnit() : shipping_interval_unit_type; // Loop through each product grid item

        selectors.products().each(function () {
          var $this = $(this);
          var id = $this.val();

          if (isBundlePricing) {
            var productDetails = $this.data("chargebundle-".concat(bundleIndex));
            id = productDetails[0];
          } // Pass the id, quantity, and programme_id
          // for each grid item we process


          var item = {
            id: id,
            quantity: 1,
            properties: {
              programme_id: programme_id,
              subscription_id: subscription_id,
              shipping_interval_unit_type: shipping_interval_unit_type,
              shipping_interval_frequency: shipping_interval_frequency,
              charge_interval_frequency: charge_interval_frequency,
              charge_interval_unit_type: charge_interval_unit_type
            }
          };
          cart.push(item);
        }); // Loop through each upsell item

        selectors.upsells().each(function () {
          var product_id = $(this).val();
          var upsell_qty = $("[name=\"upsell[".concat(product_id, "][qty]\"]")).val(); // Pass the product_id, quantity, and programme_id
          // for each grid item we process

          var item = {
            id: product_id,
            quantity: upsell_qty
          };
          cart.push(item);
        });

        return cart;
      },
      processToCart: function processToCart(items) {
        var addToCartButton = selectors.addToCart(); // First, we switch the status of the button

        addToCartButton.attr('disabled', 'disabled');
        utilities.loading('start');
        fetch(window.theme.localeRootUrl + '/cart/add.js', {
          body: JSON.stringify({
            'attributes': {
              'programme_id': settings.PROGRAMME_ID,
              'programme_name': utilities.getName(),
              'programme_email': utilities.getEmail(),
              'programme_dob': utilities.getDOB(),
              'programme_food': utilities.getFood(),
              'programme_milestone': utilities.getMilestone(),
              'programme_stage': utilities.checkCycle(),
              'programme_has_edited': 'false',
              'prgoramme_has_jumped_stage': 'false',
              'programme_stage_jumped': ''
            },
            // 'note': `[STAGE=${utilities.checkCycle()}]`,
            'items': items
          }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header

          }
        }).then(function (response) {
          utilities.loading('end');

          if (response.ok) {
            $(cssSelectors.restart).removeClass('hidden'); // We simply trigger an event so the mini-cart can re-render

            document.dispatchEvent(new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: items[0].id,
                quantity: items[0].quantity
              }
            }));
          } else {
            response.json().then(function (content) {
              addToCartButton.removeAttr('disabled');
              addToCartButton.after("<span class=\"ProductForm__Error Alert Alert--error\">".concat(content['description'], "</span>"));
              setTimeout(function () {
                addToCartButton.siblings('.ProductForm__Error').remove();
              }, 2500);
            });
          }
        });
      }
    },
    validate: function validate() {
      var isValid = true;
      selectors.requiredFields().each(function () {
        if ($(this).val() == '') {
          isValid = false;
          return false;
        }
      });
      selectors.progCTA().prop('disabled', !isValid);
    },
    updateUpsellQuantity: function updateUpsellQuantity(item, qty) {
      var upsellId = item.find('[name="programme[upsells]"]').val();
      var qtyInput = item.find("[name=\"upsell[".concat(upsellId, "][qty]\"]"));
      var qtyDisplay = item.find('.ProductItem__Quantity');
      var currentQty = +qtyInput.val();
      var newQty = currentQty + qty;

      if (newQty >= 0) {
        qtyInput.val(newQty);
        qtyDisplay.text(newQty);
      }
    }
  }; // Bind our handlers

  var bind = function bind() {
    // Form submission
    $('body').on('click', '.GroupCta .Button', function (event) {
      event.preventDefault();
      var stage = $(this).data('stage');
      if (stage === 'confirm') utilities.go.confirm();else utilities.go.stage(stage);
    });
    $('body').on('click', '.ProductItem__Minus', function () {
      var item = $(this).closest('.ProductItem');
      utilities.updateUpsellQuantity(item, -1);
    }); // Registers each grid item's plus button

    $('body').on('click', '.ProductItem__Plus', function () {
      var item = $(this).closest('.ProductItem');
      utilities.updateUpsellQuantity(item, 1);
    });
    $('body').on('click', cssSelectors.loadMore, function (event) {
      event.preventDefault();
      utilities.loading('start');
      $('.ProductList > .hidden-phone').removeClass('hidden-phone');
      $(cssSelectors.loadMore).attr('disabled', 'disabled').hide();
      utilities.loading('end');
    }); // Stage icons

    selectors.stagesIcons().on('click', function (event, element) {
      event.preventDefault();
      var $this = $(this); // If is already active or isn't complete, bail

      if ($this.hasClass('is-active') || !$this.hasClass('is-complete')) return; // Map the index to the correct stage

      var index = selectors.stagesIcons().index($this);
      var stage = utilities.mapStage(index);
      utilities.go.stage(stage);
    }); // Required text inputs, email & DOB

    selectors.requiredFields().on('blur', utilities.validate);
  }; // Call the bind() function to register click handlers


  function init() {
    if (selectors.progDiv().length > 0) {
      bind();
      flatpickr("#ProgrammeDate", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        maxDate: new Date(),
        onChange: utilities.validate
      });
      utilities.validate();
    }
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var cssSelectors$1 = {
    addToCart: '#box-add-to-cart',
    addToCartBasic: '.ProductForm__AddToCart',
    inactive: 'is-inactive',
    applyFilters: '[data-action="apply-mm-tags"]',
    resetFilters: '[data-action="reset-mm-tags"]',
    toggleTag: '[data-action="toggle-mm-tag"]',
    closeDrawer: '#collection-filter-drawer [data-action="close-drawer"]'
  };
  var selectors$1 = {
    boxDiv: function boxDiv() {
      return $('.Box');
    },
    boxGrid: function boxGrid() {
      return $('.Grid--box');
    },
    boxGridCells: function boxGridCells() {
      return $('.Grid--box > .Grid__Cell');
    },
    boxDetailsDiv: function boxDetailsDiv() {
      return $('.Box__Details');
    },
    boxQuantities: function boxQuantities() {
      return $('.ProductItem__Quantity');
    },
    boxAdd: function boxAdd() {
      return $('.ProductItem__Plus');
    },
    boxMinus: function boxMinus() {
      return $('.ProductItem__Minus');
    },
    addToCart: function addToCart() {
      return $(cssSelectors$1.addToCart);
    },
    radioSize: function radioSize() {
      return $('[data-box-radio-size]');
    },
    radioFrequency: function radioFrequency() {
      return $('[data-box-radio-frequency]');
    },
    max: function max() {
      return $('[data-box-max]');
    },
    maxText: function maxText() {
      return $('[data-box-max-text]');
    },
    stagesBanner: function stagesBanner() {
      return $('.StagesBanner');
    },
    filterDrawer: function filterDrawer() {
      return $('#collection-filter-drawer');
    },
    applyFilters: function applyFilters() {
      return $(cssSelectors$1.applyFilters);
    },
    resetFilters: function resetFilters() {
      return $(cssSelectors$1.resetFilters);
    },
    toggleTag: function toggleTag() {
      return $(cssSelectors$1.toggleTag);
    },
    closeDrawer: function closeDrawer() {
      return $(cssSelectors$1.closeDrawer);
    }
  };
  var utilities$1 = {
    loading: function loading(state) {
      document.dispatchEvent(new CustomEvent("theme:loading:".concat(state)));
    },
    // Utility functions used throughout the rest of the build
    generateGuid: function generateGuid() {
      // Generates a unique guid to be used for the box_id
      return v4();
    },
    calculateBoxQuantity: function calculateBoxQuantity($box) {
      // Calculates the total number of items selected on the page.
      // Will loop through all grid items and sum up the total box
      // quantity based on the data-qty attribute of each variant.
      // 1.) $box = top level box div of the grid matrix
      var box_qty = 0;
      $box.find('.BoxItem').each(function () {
        box_qty += +$(this).data('box-qty');
      });
      return box_qty;
    },
    boxMin: function boxMin() {
      return +selectors$1.boxGrid().data('box-min');
    },
    boxMax: function boxMax() {
      return +selectors$1.boxGrid().data('box-max');
    },
    updateBoxQuantity: function updateBoxQuantity($item, increment) {
      // Main function to handle quantity manipulation. Pass in the grid
      // item along with the quantity to increment or decrement. Then it will
      // determine the current and new item/box quantities. Then it checks
      // constraints, and if valid, update all necessary data attributes,
      // interface output, and enable/disable any buttons.
      // 1.) $item = the clicked plus or minus .BoxItem parent div
      // 2.) increment = the amount to increase or decrease the quantity
      // Get box parent reference and min/max numbers
      var $box = selectors$1.boxGrid();
      var box_min = utilities$1.boxMin();
      var box_max = utilities$1.boxMax(); // Calculate current item and box quantity

      var box_qty = utilities$1.calculateBoxQuantity($box);
      var item_qty = +$item.data('box-qty'); // Calculate the new box and item quantities with the increment added

      var new_box_qty = box_qty + increment;
      var new_item_qty = item_qty + increment;

      if (new_box_qty > 0) {
        if (selectors$1.stagesBanner().is(".".concat(cssSelectors$1.inactive))) selectors$1.stagesBanner().removeClass(cssSelectors$1.inactive);
      } else {
        selectors$1.stagesBanner().addClass(cssSelectors$1.inactive);
      } // Check constraints to make sure we can perform the action


      if (constraints.isItemGreaterThanZero(new_item_qty) && constraints.isBoxGreaterThanMin(new_box_qty, box_min) && constraints.isBoxLessThanMax(new_box_qty, box_max)) {
        // Update quantities and price
        utilities$1.updateCounts($item, new_item_qty, new_box_qty);
        utilities$1.updatePrice();
        utilities$1.disableAdditions(new_box_qty, box_max); // Toggle the Add to Cart Button if max items is reached

        utilities$1.checkAddToCart(new_box_qty, box_max); // Update plus/minus button's disabled property

        utilities$1.checkToggles(new_box_qty);
      }
    },
    checkAddToCart: function checkAddToCart(new_box_qty, box_max) {
      var is_disabled = constraints.isBoxEqualMax(new_box_qty, box_max) ? false : true;
      selectors$1.addToCart().prop('disabled', is_disabled);
      $('#update-order').prop('disabled', is_disabled); // TODO setup for extras

      if (is_disabled) {
        $('[data-box-stage-02], [data-box-stages-complete]').addClass('is-active').removeClass('is-complete');
        $('[data-box-stage-01], [data-box-stage-04]').removeClass('is-active');
      } else {
        $('[data-box-stage-01], [data-box-stage-02], [data-box-stages-complete]').removeClass('is-active').addClass('is-complete');
        $('[data-box-stage-04]').addClass('is-active');
      }
    },
    checkToggles: function checkToggles(new_box_qty) {
      var $box = selectors$1.boxGrid();
      var box_min = utilities$1.boxMin();
      var box_max = utilities$1.boxMax();
      $box.find('.BoxItem').each(function () {
        var $this = $(this);
        var item_qty = $this.data('box-qty');
        var box_qty = new_box_qty || item_qty;
        var is_plus_disabled = constraints.isBoxEqualParam(box_qty, box_max) ? true : false;
        var is_minus_disabled = constraints.isBoxEqualParam(box_qty, box_min) || constraints.isBoxEqualParam(item_qty, 0) ? true : false;
        $this.find('.ProductItem__Plus').prop('disabled', is_plus_disabled);
        $this.find('.ProductItem__Minus').prop('disabled', is_minus_disabled);
      });
    },
    updateCounts: function updateCounts($item, new_item_qty, new_box_qty) {
      $item.data('box-qty', new_item_qty);
      $item.find('.ProductItem__Quantity').html(new_item_qty);
      $('[data-box-total]').html(new_box_qty);
    },
    updatePrice: function updatePrice() {
      // Main function to update price div within the .Box__Details class div.
      // Function will loop through all grid items and grab their qty and variant_id.
      // Then it uses the ReCharge object to determine the correct price based on
      // which purchase type the user has selected (One-time purchase or Subscribe & Save).
      // Based on purchase type, function will multiple the appropriate price by quantity
      // and sum all prices together to generate a total price. This price is then
      // output to the .Box__Price div.
      // Get box parent and product references
      var $box = selectors$1.boxGrid();
      var box_max = utilities$1.boxMax(); // Determine whether the user has the One-time purchase or
      var price = 0; // Loop through all product grid items

      $box.find('.BoxItem').each(function () {
        var $this = $(this); // If grid item's quantity is above 0, use ReCharge
        // object to determine price and multiple by quantity

        var qty = +$this.data('box-qty');

        if (qty > 0) {
          var variant_details = JSON.parse($this.attr("data-box-variant-".concat(box_max)));
          var variant_id = variant_details[0];
          var variant_price = variant_details[1]; // if (is_subscription) {
          //     var duplicate_variant_id = product.variant_to_duplicate[variant_id];
          //     variant_price = product.duplicate_to_price[duplicate_variant_id];
          // }

          price += qty * (+variant_price / 100);
        }
      }); // Format price into currency and output to .Box__Price div
      // var $details = selectors.boxDetailsDiv();
      // Calculate current item and box quantity

      var $box = selectors$1.boxGrid();
      var box_qty = utilities$1.calculateBoxQuantity($box);
      var price_per = isNaN(price / box_qty) ? 0 : price / box_qty;
      var formatted_price = price_per.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });
      $('[data-box-price-per]').html(formatted_price);
    },
    reduceQuantities: function reduceQuantities() {
      var $quantities = selectors$1.boxQuantities();
      var $box = $('.Grid--box');
      var box_max = +$box.data('box-max');
      $quantities.each(function () {
        var $this = $(this);
        var qty = +$this.text(); // Calculate current item and box quantity

        var box_qty = utilities$1.calculateBoxQuantity($box);
        if (qty === 0 || box_qty <= box_max) return;
        var $item = $this.closest('.BoxItem');

        if (box_qty - qty > box_max) {
          utilities$1.updateCounts($item, 0, box_qty);
        } else if (box_qty - qty <= box_max) {
          var new_item_qty = qty - (box_qty - box_max);
          utilities$1.updateCounts($item, new_item_qty, box_max);
        }
      });
    },
    checkRadios: function checkRadios() {
      if ($('[data-box-stage-01]').is('.is-complete')) return;
      var boxSize = selectors$1.radioSize().find(':checked');
      var boxFrequency = selectors$1.radioFrequency().find(':checked');

      if (boxSize.length > 0 && boxFrequency.length > 0) {
        $('[data-box-stage-01]').removeClass('is-active').addClass('is-complete');
        $('[data-box-stage-02]').addClass('is-active');
      }
    },
    checkRadioSize: function checkRadioSize() {
      var boxSize = +selectors$1.radioSize().find(':checked').val();
      utilities$1.setMax(boxSize); // Calculate current item and box quantity

      var $box = $('.Grid--box');
      var box_qty = utilities$1.calculateBoxQuantity($box); // Toggle the Add to Cart Button if max items is reached

      utilities$1.checkAddToCart(box_qty, boxSize); // Reduce selected box quantities to new max

      if (constraints.isBoxOverMax(box_qty, boxSize)) utilities$1.reduceQuantities();
    },
    setMax: function setMax(size) {
      var $box = selectors$1.boxGrid();
      $box.data('box-max', +size);
      selectors$1.maxText().text(size);
    },
    disableAdditions: function disableAdditions(qty, max) {
      if (qty == max) {
        selectors$1.boxAdd().attr('disabled', 'disabled');
      } else if (qty < max) {
        selectors$1.boxAdd().removeAttr('disabled');
      }
    },
    cart: {
      // Functions used when adding the box to the cart
      processAddToCart: function processAddToCart() {
        // Top level function tied to the Add to Cart button.
        // Function will check constraints to make sure we can
        // add the box to the cart, then it will generate
        // the cart array and make the AJAX call to Shopify's API.
        // Once added to cart, we redirect to the /cart page.
        // Get box parent, box max value, and total box quantity values
        var $box = selectors$1.boxGrid();
        var qty = utilities$1.calculateBoxQuantity($box);
        var box_max = +$box.data('box-max'); // Ensure we can process the cart, and if not, break out of function

        if (!constraints.isBoxEqualMax(qty, box_max)) {
          console.log('Cannot process Add to Cart. Qty does not equal max total.');
          return;
        } // Generate the product array to pass to AJAX call


        var items = utilities$1.cart.generateCart($box, 'product'); // Ensure there are items to add to cart, and if so, make
        // API call and redirect to /cart page

        if (items.length > 0) {
          utilities$1.cart.processToCart(items);
        } else {
          console.log('No items available to add to cart.');
        }
      },
      generateCart: function generateCart($box, product) {
        // Check that the box quantity is equal to param
        // 1.) $box = top level box div of the grid matrix
        // 2.) product = the ReCharge product object tied to the page
        var cart = []; // var is_subscription = utilities.isSubscription(product);
        var box_max = utilities$1.boxMax(); // box_id that we will pass to each product object as a
        // line item property to associate them to this box

        var box_id = utilities$1.generateGuid();
        console.log(box_id); //TG var box_id = uuid();
        // Determine whether the user has the One-time purchase or
        // Subscribe & Save purchase type option selected. If Subscribe
        // & Save, generate the shipping interval unit_type and frequency
        // that are passed through on ReCharge orders.
        // if (is_subscription) {

        var subscription_id = $('#rc_subscription_id').val();
        var shipping_interval_unit_type = $('#rc_shipping_interval_unit_type').val();
        var shipping_interval_frequency = $('[name="BoxFrequency"]:checked').val(); // }
        // Loop through each product grid item

        $box.find('.BoxItem').each(function () {
          var $this = $(this); // If item's quantity is greater than 0, add
          // to the cart array

          var qty = +$this.data('box-qty');

          if (qty > 0) {
            var variant_details = JSON.parse($this.attr('data-box-variant-' + box_max));
            var variant_id = variant_details[0];
            var variant_price = variant_details[1]; // Pass the variant_id, quantity, and box_id
            // for each grid item we process

            var item = {
              id: variant_id,
              quantity: qty,
              properties: {
                box_id: box_id,
                box_max: box_max
              }
            }; // If this is a Subscribe & Save box, pass in the
            // ReCharge properties too
            // if (is_subscription) {
            // item['id'] = product.variant_to_duplicate[variant_id];

            item['properties']['subscription_id'] = subscription_id;
            item['properties']['shipping_interval_unit_type'] = shipping_interval_unit_type;
            item['properties']['shipping_interval_frequency'] = shipping_interval_frequency; // }

            cart.push(item);
          }
        });
        return cart;
      },
      processToCart: function processToCart(items) {
        // console.log(items);
        // Makes API call to add box items to cart. If the
        // call is successful, redirect to /cart page. If error,
        // display the error to the console.
        // 1.) items = the product array to be passed to the Shopify
        // API. cart.generateCart() function builds this array.
        //TG
        var addToCartButton = selectors$1.addToCart(); // First, we switch the status of the button

        addToCartButton.attr('disabled', 'disabled');
        utilities$1.loading('start'); // Then we add the product in Ajax

        fetch(window.theme.localeRootUrl + '/cart/add.js', {
          body: JSON.stringify({
            'items': items
          }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header

          }
        }).then(function (response) {
          utilities$1.loading('end');

          if (response.ok) {
            // addToCartButton.removeAttr('disabled');
            // We simply trigger an event so the mini-cart can re-render
            document.dispatchEvent(new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: items[0].id,
                quantity: items[0].quantity
              }
            }));
          } else {
            response.json().then(function (content) {
              // var errorMessageElement = document.createElement('span');
              // errorMessageElement.className = 'ProductForm__Error Alert Alert--error';
              // errorMessageElement.innerHTML = content['description'];
              addToCartButton.removeAttr('disabled'); // addToCartButton.after(errorMessageElement);

              addToCartButton.after('<span class="ProductForm__Error Alert Alert--error">' + content['description'] + '</span>');
              setTimeout(function () {
                addToCartButton.siblings('.ProductForm__Error').remove();
              }, 2500);
            });
          }
        });
      }
    },
    addToCart: function () {
      var _addToCart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var cart;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                $('[data-box-stage-04]').addClass('is-active');
                _context.next = 3;
                return fetch('/cart.js', {
                  method: 'GET'
                }).then(function (response) {
                  return response.json();
                }).catch(function (error) {
                  console.error('Error:', error);
                  return error.json();
                });

              case 3:
                cart = _context.sent;
                utilities$1.cart.processAddToCart();
                return _context.abrupt("return", cart);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function addToCart() {
        return _addToCart.apply(this, arguments);
      }

      return addToCart;
    }(),
    loadExtras: function loadExtras() {
      utilities$1.loading('start');
      var url = "".concat(window.theme.collections, "upsell");
      fetch(url, {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (response) {
        response.text().then(function (result) {
          utilities$1.loading('end');

          if (response.ok) {
            $('#shopify-section-collection-template').hide();
            $('#BoxUpsell').html(result).show(); // utilities.showBanner();
            // utilities.setCompleteStage(stageNumber-1);
            // utilities.setActiveStage(stageNumber);
            // utilities.scroll();
            // utilities.bringImagesIn(theStage);
          }
        });
      });
    },
    toggleDrawer: function toggleDrawer() {
      // const currentState = selectors.filterDrawer().attr('aria-hidden');
      // selectors.filterDrawer().attr('aria-hidden', currentState === 'false' ? 'true' : 'false');
      selectors$1.closeDrawer().trigger('click');
    }
  };
  var constraints = {
    // Requirement functions to determine whether the user is
    // performing an action that is forbidden
    isItemGreaterThanZero: function isItemGreaterThanZero(qty) {
      // Check that the item quantity doesn't fall below zero
      // 1.) qty = item quantity of the variant
      if (qty < 0) {
        console.log('Item quantity cannot be less than 0.');
        return false;
      }

      return true;
    },
    isBoxGreaterThanMin: function isBoxGreaterThanMin(qty, min) {
      // Check that the box quantity doesn't fall below the minimum quantity
      // 1.) qty = total box quantity of the page
      // 2.) min = minimum value the box quantity can't fall below
      if (qty < min) {
        console.log('Quantity cannot be less than the minimum.');
        return false;
      }

      return true;
    },
    isBoxLessThanMax: function isBoxLessThanMax(qty, max) {
      // Check that the box quantity doesn't go above the maximum quantity
      // 1.) qty = total box quantity of the page
      // 2.) max = maximum value the box quantity can't rise above
      if (+qty > +max) {
        console.log('Quantity cannot be greater than maximum.');
        return false;
      }

      return true;
    },
    isBoxEqualMax: function isBoxEqualMax(qty, max) {
      // Check that the box quantity is equal to the maximum quantity
      // 1.) qty = total box quantity of the page
      // 2.) max = maximum value the box quantity can't rise above
      return qty == max ? true : false;
    },
    isBoxEqualParam: function isBoxEqualParam(qty, param) {
      // Check that the box quantity is equal to param
      // 1.) qty = total box quantity of the page
      // 2.) param = value to compare qty against
      return qty == param ? true : false;
    },
    isBoxOverMax: function isBoxOverMax(qty, max) {
      // Check that the box quantity is over the maximum quantity (when changed to 12 from 24)
      // 1.) qty = total box quantity of the page
      // 2.) max = maximum value the box quantity can't rise above
      return qty > max ? true : false;
    }
  };

  var bind$1 = function bind() {
    // Initialization function to register all click handlers
    // Registers each grid item's minus button
    $('body').on('click', '.ProductItem__Minus', function () {
      var item = $(this).closest('.BoxItem');
      utilities$1.updateBoxQuantity(item, -1);
    }); // Registers each grid item's plus button

    $('body').on('click', '.ProductItem__Plus', function () {
      var item = $(this).closest('.BoxItem');
      utilities$1.updateBoxQuantity(item, 1);
    }); // Registers the page's Add to Cart button

    $('body').on('click', cssSelectors$1.addToCart, function (event) {
      event.preventDefault();
      utilities$1.addToCart(); // utilities.loadExtras();
    });

    $('body').on('change', '.Radio', function () {
      utilities$1.checkRadios();
      utilities$1.checkRadioSize();
      utilities$1.checkToggles();
      utilities$1.updatePrice();
    }); // Filters
    // $('body').on('click', cssSelectors.resetFilters, function(e) {
    //   const toggles = selectors.toggleTag();
    //   toggles.removeClass('is-active');
    //   selectors.boxGridCells().show();
    //   utilities.toggleDrawer();
    // });

    $('body').on('click', cssSelectors$1.toggleTag, function (e) {
      var tag = $(this);
      if (tag.is('.collection-filters_link--active')) return false;
      var activeTag = tag.data('tag');
      if (activeTag === undefined) return false;
      $('.collection-filters_link--active').removeClass('collection-filters_link--active');
      tag.addClass('collection-filters_link--active');
      selectors$1.boxGridCells().show();
      if (activeTag !== 'all') selectors$1.boxGridCells().filter(":not(.is-tag--".concat(activeTag, ")")).hide();
    }); //   $('body').on('click', cssSelectors.applyFilters, function(e) {
    //     e.preventDefault();
    //     const activeTag = $('.Drawer__Main .Link.is-active').data('tag');
    //     selectors.boxGridCells().show();
    //     utilities.toggleDrawer();
    //     if (activeTag === undefined) return false;
    //     selectors.boxGridCells().filter(`:not(.is-tag--${activeTag})`).hide();
    //   });
    //   //data-box-stages-complete
  }; // Call the init() function to register click handlers


  function init$1() {
    if (selectors$1.boxDiv().length > 0) {
      bind$1();
      utilities$1.checkToggles();
    }
  }
  window.initBox = init$1;

  var cssSelectors$2 = {
    cartItemPage: '.CartItemWrapper',
    cartItemCart: '.CartItem',
    cartOpen: '[data-action="open-drawer"]',
    removeGroup: '[data-action="remove-group"]',
    money: '[data-money-convertible]'
  };
  var selectors$2 = {
    template: function template() {
      return $('#CartItemTemplate');
    },
    templateGroup: function templateGroup() {
      return $('#CartItemTemplateGroup');
    },
    cart: function cart() {
      return $('.Cart__ItemList');
    },
    cartItems: function cartItems() {
      return $(cssSelectors$2.cartItem);
    },
    cartTotals: function cartTotals() {
      return $('.Cart__Totals, .Cart__Total');
    },
    addToCart: function addToCart() {
      return $('#box-add-to-cart');
    },
    headerCart: function headerCart() {
      return $('.Header__CartDot');
    },
    terms: function terms() {
      return $('#CartTerms');
    },
    checkout: function checkout() {
      return $('[name="checkout"]');
    }
  };
  var utilities$2 = {
    whichPage: function whichPage() {
      return window.theme.template !== 'cart';
    },
    clearHTML: function clearHTML() {
      selectors$2.cart().find(utilities$2.whichPage() ? cssSelectors$2.cartItemPage : cssSelectors$2.cartItemCart).remove();
    },
    cartButton: function cartButton(cart) {
      var subscription = utilities$2.subscriptionInCart(cart);
      var sideCart = document.getElementById('sidebar-cart');
      var customer = false;

      // If sidecart exist and customer is logged in return
      if (sideCart) {
        customer = sideCart.dataset.customer;
      }

      if (subscription == false) {
        return;
      }

      if (customer == 'true') {
        // utilities$2.cartButtonRecharge();
      } else {
        utilities$2.cartButtonSwitch();
      }
    },
    subscriptionInCart: function subscriptionInCart(cart) {
      var subscription = false;

      if (cart) {
        cart.items.forEach(element => {
          if(element.hasOwnProperty('properties')) {
            if(element.properties != null) {
              if(element.properties.hasOwnProperty('subscription_id')) {
                subscription = true;
              }
            }
          }
        });
      }

      return subscription;
    },
    cartButtonRecharge: function cartButtonRecharge() {
      function get_cart_token() {
        // Build the cart_token param for the URL generator
        try {
          return ['cart_token=' + (document.cookie.match('(^|; )cart=([^;]*)')||0)[2]];
        } catch (e) {
          return [];
        }
      }

      function get_ga_linker() {
        // Build the ga_linker param for the URL generator
        try {
          return [ga.getAll()[0].get('linkerParam')];
        } catch (e) {
          return [];
        }
      }

      function buildCheckoutUrl() {
        var checkout_url = 'https://' + window.theme.checkout_domain + '/r/checkout?',
          url_params = [
            'myshopify_domain=' + window.theme.permanent_domain,
          ];
        url_params = url_params
          .concat(get_cart_token())
          .concat(get_ga_linker());

        return checkout_url + url_params.join('&');
      }

      var checkoutURL = buildCheckoutUrl();
      var cartDrawerForm = document.getElementById('CartDrawer');

      if (!cartDrawerForm) { return }

      cartDrawerForm.action = checkoutURL;
    },
    cartButtonSwitch: function cartButtonSwitch(cart) {
      // console.log(`🧘 No Account 🟥 and Sub in cart`)
    },
    createItems: function createItems(obj) {
      for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        var cartTemplateGroup = selectors$2.templateGroup();
        var tmpl = cartTemplateGroup.html();
        tmpl = tmpl.replaceAll('${title}', value.title);
        tmpl = tmpl.replaceAll('${qty}', value.total);
        tmpl = tmpl.replaceAll('${price}', formatMoney(value.final_line_price, window.theme.moneyFormat));
        tmpl = tmpl.replaceAll('${uuid}', key);
        tmpl = tmpl.replaceAll('${keys}', value.items.join(','));
        tmpl = tmpl.replaceAll('${inputs}', value.inputs.join(''));
        tmpl = tmpl.replaceAll('${properties}', value.properties.join(''));
        var wrappedItem = utilities$2.wrap(tmpl);
        utilities$2.addItem(wrappedItem);
      }
    },
    loading: function loading(state) {
      document.dispatchEvent(new CustomEvent("theme:loading:".concat(state)));
    },
    addItem: function addItem(tmpl) {
      selectors$2.cart().append(tmpl); // const timelineLite = new TimelineLite();
      // const display = utilities.whichPage() ? 'table' : 'table-row';
      // timelineLite.fromTo($('.CartItem:last'), 0.5, { autoAlpha: 0, display: 'none', y: 20 }, { autoAlpha: 1, y: 0, display: display })
    },
    updateTotals: function updateTotals(total_price) {
      var total = formatMoney(total_price, window.theme.moneyFormat);
      selectors$2.cartTotals().find(cssSelectors$2.money).text(total);
    },
    wrap: function wrap(tmpl) {
      return utilities$2.whichPage() ? "<div class=\"CartItemWrapper\">".concat(tmpl, "</div>") : tmpl;
    },
    empty: function () {
      var _empty = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(items) {
        var clear, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                utilities$2.loading('start');
                clear = {};
                items.forEach(function (element) {
                  clear[element] = 0;
                });
                _context.next = 5;
                return fetch(window.theme.localeRootUrl + '/cart/update.js', {
                  body: JSON.stringify({
                    'updates': clear
                  }),
                  credentials: 'same-origin',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header

                  }
                });

              case 5:
                response = _context.sent;
                utilities$2.loading('end');
                _context.next = 9;
                return response.json();

              case 9:
                return _context.abrupt("return", _context.sent);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function empty(_x) {
        return _empty.apply(this, arguments);
      }

      return empty;
    }(),
    cart: function () {
      var _cart = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var cart, response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetch('/cart.js', {
                  method: 'GET'
                });

              case 2:
                cart = _context2.sent;
                _context2.next = 5;
                return cart.json();

              case 5:
                response = _context2.sent;
                _context2.next = 8;
                return response;

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function cart() {
        return _cart.apply(this, arguments);
      }

      return cart;
    }()
  };

  var build = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var cart, cartItems, cartTemplate, items, bundles, _i2, _Object$entries2, _Object$entries2$_i, key, item, bundle, bundle_key, title, tmpl, wrappedItem;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return utilities$2.cart();

            case 2:
              cart = _context3.sent;
              cartItems = cart.items;
              cartTemplate = selectors$2.template();
              items = [];
              bundles = {
                boxes: {},
                programmes: {}
              };
              utilities$2.updateTotals(cart.total_price);
              utilities$2.cartButton(cart);

              for (_i2 = 0, _Object$entries2 = Object.entries(cartItems); _i2 < _Object$entries2.length; _i2++) {
                _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2), key = _Object$entries2$_i[0], item = _Object$entries2$_i[1];

                // Bundled product
                if (item.properties && ('box_id' in item.properties || 'programme_id' in item.properties)) {
                  bundle = 'box_id' in item.properties ? 'boxes' : 'programmes';
                  bundle_key = 'box_id' in item.properties ? 'box_id' : 'programme_id';
                  title = 'box_id' in item.properties ? 'Build a box bundle' : 'Programme scheme bundle';

                  if (!(item.properties[bundle_key] in bundles[bundle])) {
                    bundles[bundle][item.properties[bundle_key]] = {};
                    bundles[bundle][item.properties[bundle_key]]['title'] = title;
                    bundles[bundle][item.properties[bundle_key]]['items'] = [];
                    bundles[bundle][item.properties[bundle_key]]['inputs'] = [];
                    bundles[bundle][item.properties[bundle_key]]['properties'] = [];
                    bundles[bundle][item.properties[bundle_key]]['properties'].push("<li class=\"CartItem__Property\">Ships every ".concat(+item.properties.shipping_interval_frequency === 1 ? '' : item.properties.shipping_interval_frequency, " ").concat(item.properties.shipping_interval_unit_type.toLowerCase()).concat(item.properties.shipping_interval_unit_type.charAt(item.properties.shipping_interval_unit_type.length - 1) === 's' ? '' : 's', "</li>"));
                    if ('charge_interval_frequency' in item.properties) bundles[bundle][item.properties[bundle_key]]['properties'].push("<li class=\"CartItem__Property\">Charge every ".concat(item.properties.charge_interval_frequency, " ").concat(item.properties.charge_interval_unit_type.toLowerCase()).concat(item.properties.charge_interval_unit_type.charAt(item.properties.charge_interval_unit_type.length - 1) === 's' ? '' : 's', "</li>"));
                  }

                  bundles[bundle][item.properties[bundle_key]]['items'].push(item.key);
                  bundles[bundle][item.properties[bundle_key]]['inputs'].push("<input type=\"hidden\" disabled name=\"updates[]\" id=\"updates_".concat(item.key, "\" class=\"QuantitySelector__CurrentQuantity\" pattern=\"[0-9]*\" data-line-id=\"").concat(item.key, "\" value=\"1\">"));
                  bundles[bundle][item.properties[bundle_key]]['total'] = 'total' in bundles[bundle][item.properties[bundle_key]] ? bundles[bundle][item.properties[bundle_key]]['total'] + item.quantity : item.quantity;
                  bundles[bundle][item.properties[bundle_key]]['final_line_price'] = 'final_line_price' in bundles[bundle][item.properties[bundle_key]] ? bundles[bundle][item.properties[bundle_key]]['final_line_price'] + item.final_line_price : item.final_line_price; // Or is a one off item
                } else {
                  tmpl = cartTemplate.html();
                  tmpl = tmpl.replaceAll('${image}', item.featured_image.url);
                  tmpl = tmpl.replaceAll('${ratio}', item.featured_image.aspect_ratio);
                  tmpl = tmpl.replaceAll('${title}', item.product_title);
                  tmpl = tmpl.replaceAll('${variant}', item.variant_title ? item.variant_title : '');
                  tmpl = tmpl.replaceAll('${price}', formatMoney(item.final_line_price, window.theme.moneyFormat));
                  tmpl = tmpl.replaceAll('${qty}', item.quantity);
                  tmpl = tmpl.replaceAll('${quantity_minus_one}', item.quantity - 1);
                  tmpl = tmpl.replaceAll('${quantity_plus_one}', item.quantity + 1);
                  tmpl = tmpl.replaceAll('{{new_quantity}} ', '');
                  tmpl = tmpl.replaceAll('${key}', item.key);
                  tmpl = tmpl.replaceAll('${url}', item.url);
                  wrappedItem = utilities$2.wrap(tmpl);
                  items.push(wrappedItem);
                }
              }

              utilities$2.clearHTML();

              if (!jQuery.isEmptyObject(bundles['boxes'])) {
                utilities$2.createItems(bundles['boxes']);
              }

              if (!jQuery.isEmptyObject(bundles['programmes'])) {
                utilities$2.createItems(bundles['programmes']);
              }

              utilities$2.addItem(items.join(''));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function build() {
      return _ref.apply(this, arguments);
    };
  }();

  var bind$2 = function bind() {
    var $body = $('body');
    selectors$2.terms().on('click', function () {
      var checked = $(this).get(0).checked;
      selectors$2.checkout().attr('disabled', !checked);
    });
    $body.on('click', cssSelectors$2.cartOpen, function () {
      build();
    });
    $body.off('click', cssSelectors$2.removeGroup);
    $body.on('click', cssSelectors$2.removeGroup, /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(event) {
        var $this, $remove, rawIDs, ids, clear, cart, timelineLite, timelineCart;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                event.preventDefault();
                $this = $(event.target);
                $remove = $this.closest(utilities$2.whichPage() ? cssSelectors$2.cartItemPage : cssSelectors$2.cartItem);
                rawIDs = $this.data('line-ids');
                ids = rawIDs.split(',');
                _context4.next = 7;
                return utilities$2.empty(ids);

              case 7:
                clear = _context4.sent;
                _context4.next = 10;
                return utilities$2.cart();

              case 10:
                cart = _context4.sent;
                timelineLite = new TimelineLite({
                  onComplete: function onComplete() {
                    $remove.remove();
                  }
                });
                utilities$2.updateTotals(cart.total_price);
                timelineLite.to($remove, 0.5, {
                  height: 0,
                  opacity: 0,
                  ease: Cubic.easeOut
                }, 0);
                selectors$2.addToCart().prop('disabled', false);

                if (cart.item_count === 0) {
                  selectors$2.headerCart().removeClass('is-visible');

                  if (utilities$2.whichPage()) {
                    timelineLite.to($('.Cart .Drawer__Footer'), 0.5, {
                      y: '100%',
                      transition: 'none',
                      ease: Cubic.easeInOut
                    }, 0);
                  } else {
                    timelineCart = new TimelineLite({
                      onComplete: function onComplete() {
                        $('#cart-page .Container').replaceWith("\n              <div class=\"EmptyState\">\n                <div class=\"Container\">\n                  <h1 class=\"EmptyState__Title Heading Heading__h4\">Your cart is empty</h1><a href=\"/pages/join-program\" class=\"EmptyState__Action Button Button--primary\">Shop our products</a>\n                </div>\n              </div>\n            ");
                      }
                    });
                    timelineCart.to($('.Cart'), 0.5, {
                      y: '100%',
                      transition: 'none',
                      ease: Cubic.easeInOut
                    }, 0);
                  }
                } else {
                  selectors$2.headerCart().addClass('is-visible'); // fromTo($('.Cart .Drawer__Footer'), 0.5, { y: '100%' }, { autoAlpha: 1, y: 0, display: display })

                  timelineLite.to($('.Cart .Drawer__Footer'), 0.5, {
                    y: '0',
                    transition: 'none',
                    ease: Cubic.easeInOut
                  }, 0);
                }

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }; // Call the build() & init() function to register click handlers


  function init$2() {
    build();
    bind$2();
    window.buildGlobalUpsell();

    if (window.theme.template === 'cart') {
      selectors$2.checkout().attr('disabled', true);
    }
  }

  window.buildCart = init$2;

  var selectors$3 = {
    products: function products() {
      return $('.ProductItem__ImageWrapper');
    }
  };

  var bind$3 = function bind() {
    var $body = $('body');
    selectors$3.products().on('click', function (e) {
      e.preventDefault();
    });
  }; // Call the build() & init() function to register click handlers


  function init$3() {
    if (window.theme.template === 'collection') {
      bind$3();
      MicroModal.init();
    }
  }

  var bind$4 = function bind() {
    var elems = document.querySelectorAll('[data-js-rc]');

    function fetchRcCustomer() {
      return _fetchRcCustomer.apply(this, arguments);
    }

    function _fetchRcCustomer() {
      _fetchRcCustomer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var elem, customerID, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                elem = document.querySelector('[data-customer-id]');

                if (!(elem === null)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", false);

              case 4:
                customerID = elem.dataset.customerId;
                _context.next = 7;
                return fetch("/tools/recurring/get_rc_token/".concat(customerID)).then(function (res) {
                  return res.clone().text();
                }).then(function (res) {
                  return JSON.parse(res.match(/{"rc_customer":.*}}/g)[0]);
                }).catch(function (error) {
                  console.log(error);
                });

              case 7:
                res = _context.sent;
                return _context.abrupt("return", res.rc_customer);

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                console.error(_context.t0);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11]]);
      }));
      return _fetchRcCustomer.apply(this, arguments);
    }

    if (elems.length > 0) {
      fetchRcCustomer().then(function (rc_customer) {
        elems.forEach(function (link) {
          var target = link.dataset.jsRc;
          var base_path = "/tools/recurring/portal/".concat(rc_customer.hash, "/").concat('subscriptions');
          var token = "token=".concat(rc_customer.token);
          target.includes('?') ? link.href = base_path + '&' + token : link.href = base_path + '?' + token;
        });
      });
    }
  }; // Call the build() & init() function to register click handlers


  function init$4() {
    bind$4();
  }

  // import './components/_closest.polyfill.js';
  init();
  init$1();
  init$2();
  init$3();
  init$4();

}());
