export default class TaskManager {
  constructor(gameType = null) {
    this.allTasks = [
      { id: "math_easy_add", type: "math", difficulty: 1 },
      { id: "letter_find", type: "language", difficulty: 1 },
      { id: "logic_basic", type: "logic", difficulty: 1 },
      { id: "colorhop_basic", type: "colorhop", difficulty: 1 },
    ];
    
    // Filter tasks by game type if specified
    if (gameType) {
      this.tasks = this.allTasks.filter(task => task.type === gameType);
    } else {
      this.tasks = this.allTasks;
    }
  }

  getTask(level) {
    let task;
    if (this.tasks.length === 0) {
      // Fallback to all tasks if filtered list is empty
      task = this.allTasks[Math.floor(Math.random() * this.allTasks.length)];
    } else {
      task = this.tasks[Math.floor(Math.random() * this.tasks.length)];
    }
    
    // Add unique ID and timestamp to ensure re-renders
    return {
      ...task,
      id: `${task.id}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
  }
}

