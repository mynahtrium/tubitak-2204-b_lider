export default class PlayerState {
  constructor() {
    this.level = 1;
    this.xp = 0;
    this.unlockedSkills = [];
    this.history = [];
  }

  addXP(amount) {
    this.xp += amount;
    if (this.xp >= this.level * 100) {
      this.level++;
    }
  }

  unlockSkill(skill) {
    if (!this.unlockedSkills.includes(skill)) {
      this.unlockedSkills.push(skill);
    }
  }

  logTask(task, result) {
    this.history.push({ task, result, time: Date.now() });
  }
}

