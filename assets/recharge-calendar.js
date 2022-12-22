function rechargeCalendar() {
  const nodeSelectors = {
    calendar: '[data-container="calendar"]',
  };

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    const skipButtons = document.querySelectorAll(".recharge__skip-delivery");

    // document.querySelectorAll('.recharge-calendar li.is-active').forEach((el) => {
    //   el.addEventListener("click", () => {
    //     isSelected(el);
    //   }, false);
    // });

    document.querySelectorAll('.recharge-calendar li').forEach((el) => {
      el.addEventListener("click", () => {
        isScheduleDate(el);
      }, false);
    });


    skipButtons.forEach((skipButton) => {
      skipButton.addEventListener("click", () => {
        // const status = skipbutton.dataset.status;
        const date = skipButton.dataset.date;
        // const charge = skipButton.dataset.chargeId;
        skipButton.classList.add("is-disabled");

        const chargeDate = `${date}T00:00:00`;

        bulkUpdateCharge(skipButton, chargeDate);

        // if (status === "SKIPPED") {
        //   unskipDelivery(charge, date);
        // } else if (status == "QUEUED") {
        //   skipQueued(date);
        // } else {
        //   skipDelivery(date);
        // }
      }, false);
    });

    document.addEventListener("click", function (event) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the element that we care about. The element that was clicked on is made available at "e.target"
      const element = event.target;

      if (element.hasAttribute('data-trigger-schedule')) {
        handleScheduleOpen(element);
      }
    });

  }

  function buildCalendar(boxId, schedule) {
    const calendar = document.querySelector(
      `[data-calendar="${boxId}"] [data-container="calendar"]`
    );

    for (let newDay = 0; newDay < 28; newDay++) {
      var dataYear = moment().startOf("week").year();
      var tempDate = moment().startOf("week").add(newDay, "days").date();
      var tempMonth = moment()
        .startOf("week")
        .add(newDay, "days")
        .add(1, "month")
        .month();
      var formattedMonth = ("0" + tempMonth).slice(-2);
      var formattedDate = ("0" + tempDate).slice(-2);
      var cleanDate = `${dataYear}-${formattedMonth}-${formattedDate}`;
      var tempDay = moment(cleanDate).local('GB').format('ddd');
      createCalendarDate(calendar, tempDate, cleanDate, tempMonth, tempDay, boxId);
    }

    mapSchedule(calendar, boxId, schedule);
  }

  function createCalendarDate(calendar, tempDate, cleanDate, tempMonth, tempDay, boxId) {
    var monthArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var current = moment().startOf('day');
    var given = moment(cleanDate)
    var duration = moment.duration(given.diff(current)).asDays();

    var future = true;
    if (duration <= 1) {
      future = false;
    }

    var nodeMain = document.createElement("LI");
    var textNodeMain = document.createTextNode(tempDate);
    nodeMain.appendChild(textNodeMain);
    nodeMain.dataset.date = cleanDate;
    nodeMain.dataset.day = tempDate;
    nodeMain.dataset.month = monthArray[tempMonth - 1];
    nodeMain.dataset.dayClean = tempDay;
    nodeMain.dataset.future = future;
    nodeMain.dataset.boxId = boxId;

    calendar.appendChild(nodeMain);
  }

  function mapSchedule(calendar, boxId, schedule) {
    for (let i = 0; i < schedule.length; i++) {
      const date = schedule[i].date;
      const dateFormat = moment(date).format("YYYY-MM-DD");
      const orders = schedule[i].orders;

      orders.map(function (order) {
        order.subscription.properties.map(function (props) {
          if (props.name == "box_id" && props.value == boxId) {
            const calendarItem = calendar.querySelector(`[data-date="${dateFormat}"]`);

            if (!calendarItem) { return;}

            const orderStatus = schedule[i].orders["0"].charge.status;
            const chargeId = schedule[i].orders["0"].charge.id;

            calendarItem.classList.add("is-active");
            calendarItem.dataset.orderStatus = orderStatus;
            calendarItem.dataset.chargeId = chargeId;
            buttonSkipped(calendarItem, orderStatus);
          }
        });
      })
    }
  }

  function buttonSkipped(calendarItem, status) {
    if (status === "SKIPPED") {
      calendarItem.classList.remove("is-queued");
      calendarItem.classList.add("is-skipped");
    } else {
      calendarItem.classList.remove("is-skipped");
      calendarItem.classList.add("is-queued");
    }
  }

  function isSelected(item) {
    removeSelected();
    item.classList.add('is-selected');

    updateMiniDetails(item.dataset.date, item.dataset.day, item.dataset.month, item.dataset.orderStatus, item.dataset.chargeId);
  }

  function isScheduleDate(item) {
    const boxId = item.dataset.boxId;
    const container = document.querySelector(`[data-container="${boxId}"]`);
    container.querySelectorAll('.recharge-calendar li').forEach((el) => {
      el.classList.remove('is-selected')
    });

    container.querySelectorAll('.recharge__skip-delivery').forEach((el) => {
      el.classList.remove('is-disabled')
    });

    const targetText = container.querySelector('.recharge__schedule-info__text p');
    const tempDate = item.dataset.date;
    const formatDate = moment(tempDate).format('Do MMMM');

    targetText.innerHTML = `Click the update button below to have your meals prepped on ${formatDate}.</br>Your order will be delivered the next day.`;
    item.classList.add('is-selected');

    updateMiniDetails(item.dataset.date, item.dataset.day, item.dataset.month, item.dataset.orderStatus, item.dataset.chargeId, container);
  }

  function removeSelected() {
    document.querySelectorAll('.recharge-calendar li.is-active').forEach((el) => {
      el.classList.remove('is-selected')
    });
  }

  function updateMiniDetails(date, day, month, status, chargeId, container) {
    const skipbutton = container.querySelector(".recharge__skip-delivery");
    const miniDate = container.querySelector(".recharge__mini-date__date");
    const miniMonth = container.querySelector(".recharge__mini-date__month");

    miniDate.innerHTML = day;
    miniMonth.innerHTML = month;
    skipbutton.dataset.date = date;
    skipbutton.dataset.status = status;
    skipbutton.dataset.chargeId = chargeId;

    // updateSchedule(status);

    // if (status == "SKIPPED") {
    //   skipbutton.innerHTML = "Unskip this order";
    // } else {
    //   skipbutton.innerHTML = "Skip this order";
    // }
  }

  function updateSchedule(charge) {
    const status = charge || 'SKIPPED';

    if (status == 'SKIPPED') {
      nodeSelectors.scheduleText.classList.add(cssClasses.active);
    } else {
      nodeSelectors.scheduleText.classList.remove(cssClasses.active);
    }
  }

  async function skipQueued(skipDate) {
    const button = document.querySelectorAll(`[data-date="${skipDate}"]`);
    // TODO: Update the button to show the order has been skipped
    // buttonLoadingState()
    console.log('⛷️ Ski-p this order', skipDate);

    let endpoints = [
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358052' + "/skip" + "?token=" + window.customerToken,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358053' + "/skip" + "?token=" + window.customerToken,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358055' + "/skip" + "?token=" + window.customerToken
    ];

    // runAsyncFunctions(endpoints)

    return;

    $.ajax({
      url:  "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '237381762' + "/skip" + "?token=" + window.customerToken,
      // url:  "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + 'subscriptionId' + "/skip" + "?token=" + window.customerToken,
      type: "post",
      dataType: "json",
      beforeSend: () => {
        // buttonLoadingState();
      },
      success: (response) => {
        // Successful request made
        console.log('⛷️ Successfully skipped this order', response);
        // ajaxSuccess(response, skipDate);
      },
      fail: (response) => {
        // Request failed
        console.log('🟥');
        console.log(response);
      }
    })
  }

  async function runAsyncFunctions(endpoints) {
    for (const endpoint of endpoints) {
      const request = await axios.post(endpoint)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

        console.log('⛷️⛷️⛷️ Ski-ped this order ⛷️⛷️⛷️');
    }
  }

  async function skipDelivery(skipDate) {
    // const button = document.querySelectorAll(`[data-date="${skipDate}"]`);

    console.log('⛷️ Ski-p this order', skipDate);

    let endpoints = [
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358052' + "/skip" + "?token=" + window.customerToken + "&date=" + skipDate,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358053' + "/skip" + "?token=" + window.customerToken + "&date=" + skipDate,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358055' + "/skip" + "?token=" + window.customerToken + "&date=" + skipDate
    ];

    runAsyncFunctions(endpoints)

    return;

    $.ajax({
      url:  "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '237381762' + "/skip" + "?token=" + window.customerToken,
      // url: "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + subscriptionId + "/skip" + "?token=" + window.customerToken,
      type: "post",
      dataType: "json",
      data: {
        date: skipDate,
      },
      beforeSend: () => {
        // buttonLoadingState();
      },
      success: (response) => {
        // Successful request made
        console.log('⛷️ Successfully skipped this order', response);
        // ajaxSuccess(response, skipDate);
      },
      fail: (response) => {
        // Request failed
        console.log(response);
      }
    })
  }

  async function unskipDelivery(chargeId, skipDate) {
    const button = document.querySelectorAll(`[data-date="${skipDate}"]`);

    console.log('⛷️ Un Ski-p this order', skipDate);

    let endpoints = [
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358052' + "/unskip" + "?token=" + window.customerToken + "&charge_id=" + chargeId,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358053' + "/unskip" + "?token=" + window.customerToken + "&charge_id=" + chargeId,
      "/tools/recurring/portal/" + window.customerHash + "/subscriptions/" + '238358055' + "/unskip" + "?token=" + window.customerToken + "&charge_id=" + chargeId
    ];

    runAsyncFunctions(endpoints)

    return;

    $.ajax({
      url: "/tools/recurring/portal/" + customerHash + "/subscriptions/" + '238358052' + "/unskip" + "?token=" + window.customerToken,
      // url: "/tools/recurring/portal/" + customerHash + "/subscriptions/" + subscriptionId + "/unskip" + "?token=" + window.customerToken,
      type: "post",
      dataType: "json",
      data: {
        charge_id: parseInt(chargeId),
      },
      beforeSend: () => {
        // buttonLoadingState();
      },
      success: (response) => {
        // Successful request made
        console.log('⛷️ 🟢 Successfully Un skipped this order', response);
        // ajaxSuccess(response, skipDate);
      },
      fail: (response) => {
        // Request failed
        console.log('🟥');
        console.log(response);
      }
    })
  }

  function bulkUpdateCharge(element, chargeDate) {
    const boxId = element.dataset.boxId;
    const targetJson = $(`[data-product-json="${boxId}"]`);
    const htmlJson = targetJson.html();
    const bundleJson = JSON.parse(htmlJson);
    const address = bundleJson[0].item.address_id;
    const targetMessage = document.querySelector(`.recharge__schedule-info__message--${boxId}`);
    var items = [];

    bundleJson.forEach((item) => {
      const subscriptionId = item.item.id;

      const itemTemp = {
        "id": subscriptionId,
        "next_charge_scheduled_at": chargeDate
      }

      items.push(itemTemp)
    });

    let dataToSend = {
      "subscriptions": items
    }

    const url = `/tools/recurring/portal/${window.customerHash}/addresses/${address}/subscriptions-bulk-update?token=${window.customerToken}`;

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(dataToSend),
      beforeSend: function() {
        handleLoadingState(targetMessage);
      },
      success: function(response) {
        handleSuccessState(targetMessage);
      },
      error: function(response) {
        // Request failed
        handleErrorState(targetMessage)
        console.log(response.responseText);
        console.log('🟥')
      }
    });
  }

  function handleLoadingState(element) {
    element.classList.add('is-active');
    element.innerHTML = 'Updating... Please do not refresh the page';
  }

  function handleSuccessState(element) {
    element.innerHTML = 'Schedule Updated 👍';
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function handleErrorState(element) {
    element.innerHTML = 'Whoops... Looks like something went wrong. Please try again.';
  }

  function handleScheduleOpen(element) {
    const boxId = element.dataset.boxId;
    const targetContainer = document.querySelector(`.recharge-calendar__container--${boxId}`);
    targetContainer.classList.contains('is-active') ? targetContainer.classList.remove('is-active') : targetContainer.classList.add('is-active');
  }

  /**
   * Initialize the script
   */
  function init(boxId, schedule) {
    buildCalendar(boxId, schedule);
  }

  return Object.freeze({
    init,
    setEventListeners,
  });
}

window.rechargeCalendar();
