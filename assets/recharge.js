/*--------------------------------------------------------------
  # Recharge
  --------------------------------------------------------------*/
var nodeRecharge = document.querySelector('#ReCharge');
function recharge() {
  function init() {
    emoji();
    navLinkActive();
    slider();
    eventListeners()
  }

  function emoji() {
      if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        $("body").html($("body").html().replace(/\:wave\:/g,''));//fire
        $("body").html($("body").html().replace(/\:woman_shrugging\:/g,''));//fire
        $("body").html($("body").html().replace(/\:fire\:/g,''));//fire
        $("body").html($("body").html().replace(/\:sunglasses\:/g,''));//sunglasses
        $("body").html($("body").html().replace(/\:palm_tree\:/g,''));//palm tree
        $("body").html($("body").html().replace(/\:rainbow\:/g,''));//rainbow
        $("body").html($("body").html().replace(/\:heart_eyes_cat\:/g,''));//heart eyes cat
        $("body").html($("body").html().replace(/\:100\:/g,''));//100
        $("body").html($("body").html().replace(/\:tropical_fish\:/g,''));//tropical fish
        $("body").html($("body").html().replace(/\:sunny\:/g,''));//sunny
        $("body").html($("body").html().replace(/\:zap\:/g,''));//zap
        return;
      }

      function convertEmoji(str) {
        return str.replace(/\[e-([0-9a-fA-F]+)\]/g, function (match, hex) {
          return String.fromCodePoint(Number.parseInt(hex, 16));
        });
      }

      var $selector = ".rte,a,h1,h2,h3,h4,h5,h6,p,span";
      $($selector).html(function(index,html){
        return html.replace(/\:woman_shrugging\:/g,convertEmoji('[e-1F937]'));//fire
      });
      $($selector).html(function(index,html){
        return html.replace(/\:wave\:/g,convertEmoji('[e-1F44B]'));//fire
      });
      $($selector).html(function(index,html){
        return html.replace(/\:fire\:/g,convertEmoji('[e-1f525]'));//fire
      });
      $($selector).html(function(index,html){
        return html.replace(/\:sunglasses\:/g,convertEmoji('[e-1f60e]'));//sunglasses
      });
      $($selector).html(function(index,html){
        return html.replace(/\:palm_tree\:/g,convertEmoji('[e-1F334]'));//palm tree
      });
      $($selector).html(function(index,html){
        return html.replace(/\:rainbow\:/g,convertEmoji('[e-1F308]'));//rainbow
      });
      $($selector).html(function(index,html){
        return html.replace(/\:heart_eyes_cat\:/g,convertEmoji('[e-1F63B]'));//heart eyes cat
      });
      $($selector).html(function(index,html){
        return html.replace(/\:100\:/g,convertEmoji('[e-1F4AF]'));//100
      });
      $($selector).html(function(index,html){
        return html.replace(/\:tropical_fish\:/g,convertEmoji('[e-1F420]'));//tropical fish
      });
      $($selector).html(function(index,html){
        return html.replace(/\:sunny\:/g,convertEmoji('[e-1F31E]'));//sunny
      });
      $($selector).html(function(index,html){
        return html.replace(/\:zap\:/g,convertEmoji('[e-26A1]'));//zap
      });

  }

  function navLinkActive() {
    var currentPage = location.href;

    var $activeLink = $(`.rc-nav a[href="${(location.href.indexOf('#') !== -1) ? location.href.slice(0, location.href.indexOf('#')) : location.href}"]`);
    $activeLink.addClass('is-active');

    var $sideActiveLink = $(`.rc-account-nav a[href="${(location.href.indexOf('#') !== -1) ? location.href.slice(0, location.href.indexOf('#')) : location.href}"]`);
    $sideActiveLink.addClass('is-active');
  }

  function slider() {
    $('.rc-image-slider').flickity({
      // options
      cellAlign: 'left',
      contain: true
    });
  }

  function toggleOptionSubscribe() {
    $('.rc-body-item--onetime').removeClass('is-active');
    $('.rc-header-item').removeClass('is-active');
    $('.rc-header-item--onetime').addClass('is-active');
  }

  function toggleOptionOneTime() {
    $('.rc-body-item--onetime').addClass('is-active');
    $('.rc-header-item').removeClass('is-active');
    $('.rc-header-item--subscribe').addClass('is-active');
  }

  function eventListeners() {
    $('.rc-header-item--subscribe').on('click', toggleOptionSubscribe)
    $('.rc-header-item--onetime').on('click', toggleOptionOneTime)
  }

  init();
}

// if (nodeRecharge) {
  recharge();
// }

document.addEventListener('DOMContentLoaded', function (){

  // Container string to hold all generated HTML
  var base = '';
  // Create object with addressIds as keys and array of subscriptionIds as value
  if (!window.addresses)  {
    closeBuildABox();
    return
  }

  var boxes = ReCharge.Box.Lists.findBoxIds(window.addresses);
  var boxes_length = Object.keys(boxes).length;
  var programme_boxes = ReCharge.Box.Lists.findProgrammeIds(window.addresses);
  var programme_length = Object.keys(programme_boxes).length;
  var total = 0;
  //Process Active/Box Subscriptions and One-time Items
  base += '<h3 class="Heading Heading__h2 text-center">Build a Box items</h3>';
  //base += '<p class="text-center">These are the dates when your order will be placed. <br>We deliver on Tuesdays and Fridays. You will receive an email from DPD confirming actual date of delivery.</p><p class="text-center" style="font-weight: bold;">We have recently gone live with our brand new website and we are working on getting the account section fully up and running. In the meantime, if you need to edit or pause your box or update your address or payment information, please contact us at <a href="mailto:care@mamamadefood.com" style="text-decoration: underline;">care@mamamadefood.com</a> and we will get back to you ASAP.</p>';
  var hasBuildABox = false;

  if (window.addresses.length > 0) {
    for (var i= 0; i < window.addresses.length; i++) {
      var address = window.addresses[i];
      var buildABox = false;

      // Output the Address Header
      //base += ReCharge.Box.Html.addressHeader(address);

      // Output the Address Discount Form
      /*if (address.onetimes.length > 0|| address.subscriptions.length > 0) {
        base += ReCharge.Box.Html.discountForm(address);
      }*/

      total += address.subscriptions.length;

      if (address.subscriptions.length) {
        for (sub in address.subscriptions) {
          const tempSub = address.subscriptions[sub];
          for (key in tempSub.properties) {
            const tempProp = tempSub.properties[key];
            if (tempProp.hasOwnProperty('name') && tempProp.name == ['box_id']) {
              buildABox = true;
              hasBuildABox = true;
            }
          }
        }
      }

      if (buildABox === true) {
        // Output the Active Boxes Table
        if (boxes_length > 0 && (address.subscriptions.length > 0 && address.id in boxes)) {
          base += ReCharge.Box.Html.boxTable(address, boxes[address.id]);
        }

        // Output the Active Programmes Table
        if (programme_length > 0 && (address.subscriptions.length > 0 && address.id in programme_boxes)) {
          base += ReCharge.Box.Html.programmeTable(address, programme_boxes[address.id]);
        }

        // Output the Active Subscriptions Table
        if (address.subscriptions.length > 0 && ReCharge.Box.Utils.hasNonBoxSubscription(address.subscriptions)) {
          base += ReCharge.Box.Html.subscriptionTable(address.subscriptions);
        }

        // Output the Active One-time Items Table
        if (address.onetimes.length > 0) {
          base += ReCharge.Box.Html.onetimeTable(address.onetimes);
        }
      }

    }
  }

  if ((total === 0 && window.addresses.length > 0) || window.addresses.length === 0 || hasBuildABox === false) {
    base += '<p class="text-center">You don&rsquo;t currently have any active subscriptions or addresses on account.';

    $('#base-subscriptions-edit-buttons').addClass('is-hidden');
  }

  // Process Cancelled Subscriptions
  /*var cancelled_addresses = ReCharge.Box.Lists.findCancelledAddresses(window.addresses);
  if (cancelled_addresses.length > 0) {
    base += '<h3 class="Heading Heading__h2 text-center">Cancelled subscriptions</h3>';
    for (var i= 0; i<cancelled_addresses.length; i++) {
      var address = cancelled_addresses[i];

      // Output the Address Header
      base += ReCharge.Box.Html.addressHeader(address);

      // Output the Active Subscriptions Table
      if (address.subscriptions.length > 0) {
        base += ReCharge.Box.Html.cancelledSubscriptionTable(address.subscriptions, boxes[address.id]);
      }
    }
  }*/

  // Output the Active Subscriptions Table
  base += ReCharge.Box.Html.pageFooter();
  // Attach generated HTML to the page
  $('#base-subscriptions').append(base);

  flatpickr(".datepicker", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    //2020-12-27T00:00:00 - Y-m-dT00:00:00
    minDate: new Date().fp_incr(4),
    // maxDate: new Date(),
  });

  function closeBuildABox() {
    // if( $('#base-subscriptions').is(':empty') ) {
    if( !$.trim( $('#base-subscriptions').html() ).length ) {
      $('#base-subscriptions').hide();
      $('#base-subscriptions-edit-buttons').hide();
    } else {
    }
  }


  $('body').on('click', '.resume-subscription', async function(e) {
    e.preventDefault();
    var activations = [];
    $parent = $(this).closest('.box-header');
    var addressId = $parent.find('[name="address-id"]').val();
    var subscriptionIds = $parent.find('[name="subscription_ids[]"]').map(function() { return $(this).val() }).get();
    var subscriptionsToActivate = [];
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd < 10) {
      dd = '0'+ dd;
    }
    if(mm < 10) {
      mm = '0'+ mm;
    }
    date = yyyy +'-'+ mm +'-'+ dd;
    // console.log(date);

    for (var i = 0; i < subscriptionIds.length; i++) {
      subscriptionsToActivate.push({
        'id': subscriptionIds[i],
        'status': 'ACTIVE',
        'next_charge_scheduled_at': date,
      });
    }

    if (subscriptionsToActivate.length <= 20) {
      await ReCharge.Subscription.bulk_update(addressId, JSON.stringify({
        'subscriptions': subscriptionsToActivate
      }));
    } else {
      (async () => {

        try {
          const url = ReCharge.Endpoints.bulk_update_subscription_url(addressId);
          const subscriptionsToActivateSplit = chunkArray(subscriptionsToActivate, 20);

          await axios({
            url,
            method: 'post',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
              'subscriptions': subscriptionsToActivateSplit[0]
            })
          })

          await axios({
            url,
            method: 'post',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
              'subscriptions': subscriptionsToActivateSplit[1]
            })
          });

          ReCharge.Toast.addToast('success', 'Updated successfully');
          location.reload();

        } catch (error) {
          console.error(error);
        }
      })();
    }

  });

  $(document).on('submit', 'form[id^="boxUpdate_NextChargeDate"]', function(evt) {
    evt.preventDefault();
    var $form = $(this);
    var addressId = $form.find('[name="address-id"]').first().val();
    var date = $form.find('[name="date"]').first().val();
    var subscriptionIds = $form.find('[name="subscription_ids[]"]').map(function() { return $(this).val() }).get();
    var subscriptionsToUpdate = [];
    for (var i = 0; i < subscriptionIds.length; i++) {
      subscriptionsToUpdate.push({
        'id': subscriptionIds[i],
        'next_charge_scheduled_at': date,
      });
    }
    // console.log(subscriptionsToUpdate);
    // console.log(subscriptionIds);
    ReCharge.Subscription.bulk_update(addressId, JSON.stringify({
      'subscriptions': subscriptionsToUpdate
    }));
  });

  $(document).on('submit', 'form[id^="programmeUpdate_NextChargeDate"]', function(evt) {
    evt.preventDefault();
    var $form = $(this);
    var addressId = $form.find('[name="address-id"]').first().val();
    var date = $form.find('[name="date"]').first().val();
    var programme_ids = $form.find('[name="programme-ids"]').first().val().split(',');
    var programme_data = [];
    for (var i = 0; i < programme_ids.length; i++) {
      programme_data.push({
        'id': programme_ids[i],
        'next_charge_scheduled_at': date,
      });
    }
    ReCharge.Subscription.bulk_update(addressId, JSON.stringify({
      'subscriptions': programme_data
    }));
  });

  $(document).on('submit', 'form[id^="programmeUpdate_Stage"]', function(evt) {
    evt.preventDefault();
    var $form = $(this);
    var addressId = $form.find('[name="address-id"]').first().val();
    //var address_note = JSON.parse($form.find('[name="note"]').val());
    var programme_stage = $form.find('[name="programme-stage"]').val();

    // TODO: check this is working!

    ReCharge.Address.update(addressId, {
      note_attributes: [
        {
          'name': 'programme_stage',
          'value': programme_stage
        }
      ]
    });
  });

  $('body').on('click', '[data-js-cancel]', function(e) {
    e.preventDefault();
    var $this = $(this);
    var boxWrap = $this.closest('.box-wrap');
    boxWrap.find('button, a').prop('disabled', true);
    var addressId = $this.data('address-id');
    var subscriptionIds = $this.data('cancel-ids');
    // console.log("? ~ file: subscriptions.html ~ line 210 ~ $ ~ subscriptionIds", subscriptionIds)
    var subscriptions = [];

    for (var i = 0; i < subscriptionIds.length; i++) {
      subscriptions.push({
        'id': subscriptionIds[i]
      });
    }

    let url = "https://app.mamamadefood.com/.netlify/functions/server/delete/address/"+ addressId;
    let data = {
      'subscriptions': subscriptions,
      'send_email': 0
    };

    axios.all([
      axios.post(url, data),
      axios.post(url)
    ])
    .then(axios.spread((...responses) => {
      ReCharge.Toast.addToast('success', 'Box edited successfully');
      location.reload();
    }))
    .catch((e) => {
      ReCharge.Toast.addToast('error', 'Box edited failed');
      boxWrap.find('button, a').prop('disabled', false);
    })
  });


  function getVideo() {
    /**
   * Initialise component.
   */
    function init() {
      if($('[js-load-video="wrapper"]') === null ) {
        return;
      } else {
        getVideoBlock();
      }
    }

    function getVideoBlock() {
      return;
      $.ajax({
        url: `/pages/recharge`,
        type: 'GET',
      }).done(function(response) {
        // Successful request made
        buildDishes(response)
      }).fail(function(response) {
        // Request failed
        console.log(response);
      });
    }

    function buildDishes(data) {
      const filterData = $(data).find('[js-video-ajax="container"]');
      $('[js-load-video="wrapper"]').html(filterData);
    }

    init();
  }

  getVideo();

});
