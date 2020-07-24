// Handle button clicks

function didClickReload(currentParams) {
  return () => {
    // Reset the simulation
    currentParams.positions = null;
    currentParams.velocities = null;
    currentParams.accelerations = null;

    return false; // Prevent default
  };
}

export function init(currentParams) {
  var reloadButton = document.querySelector(".TwoGalaxies-reloadButton");
  reloadButton.onclick = didClickReload(currentParams);
}
