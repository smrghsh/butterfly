import * as dat from "lil-gui";

export default class Debug {
  constructor() {
    // this.active = window.location.hash === '#debug'
    // always using dat.gui for presentation
    this.active = true;
    this.main = document.querySelector("main");
    this.mainVisible = true;

    if (this.active) {
      this.ui = new dat.GUI();
      // add a toggle for the visibility of main element
      this.ui
        .add(this, "mainVisible")
        .name("Show Text")
        .onChange((value) => {
          this.toggleVisibility(value);
        })
        .listen();
    }
  }
  toggleVisibility(visible) {
    const display = visible ? "block" : "none";
    this.main.style.display = display;
  }
}
