import SickSlider from './sick_slider.js';

var expect = chai.expect;

describe('SickSlider', () => {
  beforeEach(function () {
    document.querySelector('.TestFixture').innerHTML = `
      <div class="SickSlider SickSlider--isHidden">
        <div class='SickSlider-label'>Label text</div>
        <div class="SickSlider-slider">
          <div class="SickSlider-stripe"></div>
          <div class="SickSlider-head"></div>
        </div>
      </div>
    `;
  });

  afterEach(function () {
    document.querySelector('.TestFixture').innerHTML = "";
  });

  it('valueToPosition', () => {
    var slider = SickSlider(".SickSlider", {
      label: 'Time step: ',
      value: 1, min: 0, max: 10,
      onChange: null,
    });

    var position = 0.512345678;
    var places = 2;
    var min = 0;
    var max = 10;
    expect(slider.positionToValue(position, places, min, max)).to.equal(5.12);

    places = 0;
    expect(slider.positionToValue(position, places, min, max)).to.equal(5);

    position = 0.001;
    places = 2;
    expect(slider.positionToValue(position, places, min, max)).to.equal(0.01);

    position = 0.0001;
    places = 2;
    expect(slider.positionToValue(position, places, min, max)).to.equal(0);
  });
});
