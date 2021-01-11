/**
 * The interaction manager
 * Take in account the interactions
 * responsible of the cursor's state changing.
*/
function instantiateInteractionManager() {
  function turnOn() {}
  function turnOff() {}

  return {
    on: turnOn,
    off: turnOff,
  };
}

export default instantiateInteractionManager;
