import Phaser from "phaser";
import DemoScene from "./scenes/DemoScene";


export default {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 800,
  height: 600,
  backgroundColor: "#1e1e1e",
  scene: [DemoScene],
};

