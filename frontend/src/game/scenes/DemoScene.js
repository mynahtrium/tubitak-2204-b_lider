import Phaser from "phaser";


export default class DemoScene extends Phaser.Scene {
  constructor() {
    super("DemoScene");
  }


  preload() {
    this.load.image("star", "https://labs.phaser.io/assets/demoscene/star.png");
  }


  create() {
    this.add.text(20, 20, "DreamForge Oyun Motoru Çalışıyor!", {
      fontSize: "24px",
      fill: "#ffffff",
    });


    const star = this.physics
      ? this.physics.add.image(400, 300, "star")
      : this.add.image(400, 300, "star");


    this.tweens.add({
      targets: star,
      angle: 360,
      duration: 4000,
      repeat: -1,
    });
  }
}

