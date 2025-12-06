export default class RewardSystem {
  static giveRewards(player, task, correct) {
    if (correct) {
      player.addXP(20);
      if (task.type === "logic") player.unlockSkill("logic_basic");
    }
  }
}

