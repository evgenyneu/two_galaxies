import initWebGl from './init_web_gl.js';
import drawScene from './render.js';

function main() {
  var initData = initWebGl();
  drawScene(initData);
}

window.onload = main;
