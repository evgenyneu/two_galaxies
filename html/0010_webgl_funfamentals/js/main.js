import initWebGl from './init_web_gl.js';
import render from './render.js';

function main() {
  var initData = initWebGl();
  render(initData);
}

window.onload = main;
