import Stats from "stats.js";
import Experience from "../Experience.js";

/**
 * Adding a custom Stats class so I can have three seperate panels up at the same time
 */

export default class CustomStats {
  constructor() {
    this.experience = new Experience();
    // Create Stats instances
    this.stats1 = new Stats(); // For FPS
    this.stats1.showPanel(0); // Panel 0: FPS
    document.body.appendChild(this.stats1.dom);

    this.stats2 = new Stats(); // For MS
    this.stats2.showPanel(1); // Panel 1: MS (Milliseconds between frames)
    document.body.appendChild(this.stats2.dom);

    this.stats3 = new Stats(); // For MB
    this.stats3.showPanel(2); // Panel 2: MB (Memory used, browser-dependent)
    document.body.appendChild(this.stats3.dom);

    // Position the panels on the page
    this.stats1.dom.style.position = "absolute";
    this.stats1.dom.style.left = "0px";
    this.stats1.dom.style.top = "0px";

    this.stats2.dom.style.position = "absolute";
    this.stats2.dom.style.left = "80px";
    this.stats2.dom.style.top = "0px";

    this.stats3.dom.style.position = "absolute";
    this.stats3.dom.style.left = "160px";
    this.stats3.dom.style.top = "0px";

    this.debug = this.experience.debug;
    // Add toggle visibility in debug UI
    this.statsVisible = false;
    this.toggleVisibility(this.statsVisible);
    if (this.debug && this.debug.ui) {
      this.debug.ui
        .add(this, "statsVisible")
        .name("Show Stats")
        .onChange((value) => {
          this.toggleVisibility(value);
        });
    }
  }
  toggleVisibility(visible) {
    const display = visible ? "block" : "none";
    this.stats1.dom.style.display = display;
    this.stats2.dom.style.display = display;
    this.stats3.dom.style.display = display;
  }
  begin() {
    // Begin the stats
    this.stats1.begin();
    this.stats2.begin();
    this.stats3.begin();
  }
  end() {
    // End the stats
    this.stats1.end();
    this.stats2.end();
    this.stats3.end();
  }
}
