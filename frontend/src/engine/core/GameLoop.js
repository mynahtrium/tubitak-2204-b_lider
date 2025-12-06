import PlayerState from "./PlayerState";
import TaskManager from "./TaskManager";
import RewardSystem from "./RewardSystem";


export default class GameLoop {
  constructor(onTask, onResult, gameType = null) {
    this.player = new PlayerState();
    this.taskManager = new TaskManager(gameType);
    this.onTask = onTask;
    this.onResult = onResult;
  }

  start() {
    this.nextTask();
  }

  nextTask() {
    this.currentTask = this.taskManager.getTask(this.player.level);
    this.onTask(this.currentTask);
  }

  submitAnswer(isCorrect) {
    RewardSystem.giveRewards(this.player, this.currentTask, isCorrect);
    this.player.logTask(this.currentTask, isCorrect);


    this.onResult({
      correct: isCorrect,
      xp: this.player.xp,
      level: this.player.level,
    });


    setTimeout(() => this.nextTask(), 400);
  }
}

