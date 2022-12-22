/**
 * DOM selectors.
 */
const nodeSelectors = {
  decrement: '[js-quantity-selector="decrement"]',
  increment: '[js-quantity-selector="increment"]',
  input: '[js-quantity-selector="input"]',
};

function quantitySelector() {
  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    // nodeSelectors.container.forEach((form) => {
    //   on('submit', form, (event) => handleAddToCart(event, form));
    // });

    document.addEventListener('click', function (event) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
      const element = event.target;

      // Check if it matches our previously defined selector
      if (element.matches(nodeSelectors.increment)) {
        handleChange('increment', element);
      }

      if (element.matches(nodeSelectors.decrement)) {
        handleChange('decrement', element);
      }
    });
  }

  function handleChange(type, element) {
    const input = element.parentNode.querySelector("[js-quantity-selector='input']");
    const inputValue = parseInt(input.value);
    var newValue = 0;

    if (type == 'increment') {
      newValue = inputValue + 1;
    } else {
      if (input.value == 0 ) { return }
      newValue = inputValue - 1;
    }

    input.value = newValue;
  }

  function init() {
    setEventListeners();
  }

  init();
}

quantitySelector();
