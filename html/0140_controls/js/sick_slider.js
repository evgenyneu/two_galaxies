/**
 * A Slider UI element. Also requires styles from sick_slider.css.
 *
 * Example
 * -------
 *
 * var slider = SickSlider(".SickSlider-cameraAngle", {
 *   label: 'Camera angle: ', labelSuffix: '°',
 *   value: 0,
 *   min: -360, max: 360,
 *   onChange: function(value, position){ ... }
 * });
 *
 * HTML
 * ------
 *
 * <div class="SickSlider-cameraAngle SickSlider SickSlider--isHidden">
 *   <div class='SickSlider-label'>Label text</div>
 *   <div class="SickSlider-slider SickSlider--isUnselectable">
 *     <div class="SickSlider-stripe"></div>
 *     <div class="SickSlider-head"></div>
 *   </div>
 * </div>
 *
 * Manually update the slider
 * -----------------------------
 *
 * slider.updatePositionAndLabel(100);
 *
 * @param  {string} sliderElementSelector a CSS selector of the SickSlider element.
 * @param  {object} settings              object containing slider settings.
 * @return {object}                       slider object
 */
export default function SickSlider(sliderElementSelector, settings) {
  var that = {
    // A function that will be called when user changes the slider position.
    // The function will be passed the slider position: a number between 0 and 1.
    onChange: null,

    // Initial slider value
    value: 0,

    // Minimum and maximum slider values
    min: 0,
    max: 1,

    // Text label to be shown
    label: null,

    // Text to append to the end of the label (optional)
    labelSuffix: null,

    // Number of decimal places for position to show in label
    labelDecimalPlaces: 2,

    // Use scientific notation for label (i.e. 1.23E3) when
    // log10 of abs(position) is larger than this value
    // (or smaller than its negative)
    labelLogUseScientic: 5,

    // Store the current slider position, a number from 0 to 1
    position: -42,

    // If false the slider position and label will be updated
    // on next animation frame. This is used to improve performance
    // and only update the slider no faster than 60 frames per second, as user
    // moves the slider.
    didRequestUpdateOnNextFrame: false
  };


  /**
   * Initializes the slider element
   *
   * @param  {string} sliderElementSelector a CSS selector of the SickSlider element.
   * @param  {object} settings              object containing slider settings.
   */
  that.init = function(sliderElementSelector, settings) {
    that.sliderContainer = document.querySelector(sliderElementSelector);
    that.labelElement = that.sliderContainer.querySelector(".SickSlider-label");
    that.slider = that.sliderContainer.querySelector(".SickSlider-slider");
    that.sliderHead = that.slider.querySelector(".SickSlider-head");
    var sliding = false;

    // Assign settings
    // -------

    that.value = settings.value;
    that.min = settings.min;
    that.max = settings.max;
    that.label = settings.label;
    that.onChange = settings.onChange;
    that.labelSuffix = settings.labelSuffix;

    // Set decimal places for the label
    if ('labelDecimalPlaces' in settings) {
      // Given by the user
      that.labelDecimalPlaces = settings.labelDecimalPlaces;
    } else {
      // Show decimal places if the range is larger than 10.
      if (Math.abs(that.max - that.min) > 10) { that.labelDecimalPlaces = 0; }
    }

    that.sliderContainer.classList.remove("SickSlider--isHidden");
    that.updatePositionAndLabel(that.value);

    // Start dragging slider
    // -----------------

    that.slider.addEventListener("mousedown", function(e) {
      sliding = true;
      that.updateHeadPositionOnTouch(e);
    });

    that.slider.addEventListener("touchstart", function(e) {
      sliding = true;
      that.updateHeadPositionOnTouch(e);
    });

    that.slider.onselectstart = function () { return false; };

    // End dragging slider
    // -----------------

    document.addEventListener("mouseup", function(){
      sliding = false;
    });

    document.addEventListener("dragend", function(){
      sliding = false;
    });

    document.addEventListener("touchend", function(e) {
      sliding = false;
    });

    // Drag slider
    // -----------------

    document.addEventListener("mousemove", function(e) {
      if (!sliding) { return; }
      that.updateHeadPositionOnTouch(e);
    });

    document.addEventListener("touchmove", function(e) {
      if (!sliding) { return; }
      that.updateHeadPositionOnTouch(e);
    });

    that.slider.addEventListener("touchmove", function(e) {
      if (typeof e.preventDefault !== 'undefined' && e.preventDefault !== null) {
        e.preventDefault(); // Prevent screen from sliding on touch devices when the element is dragged.
      }
    });

    that.previousSliderWidth = that.sliderContainer.offsetWidth;

    // Screen is resized
    window.addEventListener('resize', function(e) {
      if (that.sliderContainer.offsetWidth == that.previousSliderWidth) return;

      // The width of the slider has change, update its position
      that.previousSliderWidth = that.sliderContainer.offsetWidth;
      that.changePosition(that.position);
    });
  };

  /**
   * Returns the slider value (a number form 0 to 1) from the cursor position
   *
   * @param e a touch event
   * @return {number}   slider value (a number form 0 to 1) from the cursor position
   */
  that.sliderPositionFromCursor = function(e) {
    var pointerX = e.pageX;

    if (e.touches && e.touches.length > 0) {
      pointerX = e.touches[0].pageX;
    }

    pointerX = pointerX - that.slider.offsetLeft;
    var headLeft = (pointerX - 16);
    if (headLeft < 0) { headLeft = 0; }

    if ((headLeft + that.sliderHead.offsetWidth) > that.slider.offsetWidth) {
      headLeft = that.slider.offsetWidth - that.sliderHead.offsetWidth;
    }

    // Calculate slider value from head position
    var sliderWidthWithoutHead = that.slider.offsetWidth - that.sliderHead.offsetWidth;
    var sliderPosition = 1;

    if (sliderWidthWithoutHead !== 0) {
      sliderPosition = headLeft / sliderWidthWithoutHead;
    }

    return sliderPosition;
  };

  /**
   * Update the slider position and call the callback function
   *
   * @param  e A touch event
   */
  that.updateHeadPositionOnTouch = function(e) {
    var newPosition = that.sliderPositionFromCursor(e);

    // Handle the head change only if it changed significantly (more than 0.1%)
    if (Math.round(that.position * 10000) === Math.round(newPosition * 10000)) { return; }
    that.position = newPosition;

    if (!that.didRequestUpdateOnNextFrame) {
      // Update the slider on next redraw, to improve performance
      that.didRequestUpdateOnNextFrame = true;
      window.requestAnimationFrame(that.updateOnFrame);
    }
  };

  /**
   * Convert to slider position (number from 0 to 1) to slider value
   * (a number from min to max),
   *
   * @param  {number} position Slider position from 0 to 1.
   * @return {number}          Slider value from min to max.
   */
  that.positionToValue = function(position) {
    return that.min + position * (that.max - that.min);
  };

  /**
   * Make the text of the label.
   *
   * @param  {number} value Current slider position (between min and max)
   * @return {string}       Label text to be shown. If null, label is hidden.
   */
  that.makeLabelText = function(value) {
    var abs_value = Math.abs(value);
    var rounded = "";

    if (abs_value < 1e-30) {
      rounded = 0;
    } else if (Math.log10(abs_value) > that.labelLogUseScientic ||
        Math.log10(abs_value) < -that.labelLogUseScientic) {
      // Use exponential notation (i.i. 2.12e2 for 212)
      // if number is very large or small
      rounded = abs_value.toExponential(that.labelDecimalPlaces);
    } else {
      rounded = Number(value).toFixed(that.labelDecimalPlaces);
    }

    var text = `${that.label}${rounded}`;

    if (that.labelSuffix != null) {
      text += that.labelSuffix;
    }

    return text;
  };

  /**
   * Make the text of the label. The function also makes sure the width of
   * the label stays the same as it's updated with new position values
   * to prevent text from shifting on screen.
   *
   * @param  {number} value Corrent slider position (between min and max)
   * @return {string}       Label text to be shown. If null, label is hidden.
   */
  that.makeLabel = function(value) {
    var text = that.makeLabelText(value);

    // Make the label the same size as was shown previously
    // in order to prevent label text from jumping when centered
    if (that.previousLabelLength == null) {
      var textMin = that.makeLabelText(that.min);
      var textMax = that.makeLabelText(that.max);
      that.previousLabelLength = Math.max(textMin.length, textMax.length);
    }

    if (text.length < that.previousLabelLength) {
      var spacePad = "&nbsp;".repeat(that.previousLabelLength - text.length);
      text = text + spacePad;
    } else {
      that.previousLabelLength = text.length;
    }

    return text;
  };


  /**
   * Updates the text label.
   */
  that.updateLabel = function() {
    var value = that.positionToValue(that.position);
    var labelText = that.makeLabel(value);
    that.labelElement.innerHTML = labelText;
  };


  /**
   * Updates the slider, label and called the that.onChange callback.
   * This method is called on each animation frame when the slider is moved
   * by the user.
   *
   */
  that.updateOnFrame = function() {
    that.value = that.positionToValue(that.position);
    that.changePosition(that.position);
    that.updateLabel();

    if (that.onChange) {
      that.onChange(that.value, that.position);
    }

    that.didRequestUpdateOnNextFrame = false;
  };

  /**
   * Updates the slider and its label text based on the given value.
   *
   * @param  {number} value The new value of the slider.
   */
  that.updatePositionAndLabel = function(value) {
    that.value = value;
    var position = Math.abs(that.value - that.min) / Math.abs(that.max - that.min);
    that.position = position;
    that.changePosition(position);
    that.updateLabel();
  };

  /**
   * Changes the position of the slider
   *
   * @param  {type} sliderValue a value between 0 and 1
   */
  that.changePosition = function(sliderPosition) {
    var headLeft = (that.slider.offsetWidth - that.sliderHead.offsetWidth) * sliderPosition;
    that.sliderHead.style.left = headLeft + "px";
  };

  that.init(sliderElementSelector, settings);

  return that;
}
