class IdGenerator {
    constructor() {
      this.dayCounter = 1;
      this.exerciseCounter = 1;
      this.setCounter = 1;
    }
  
    reset() {
      this.dayCounter = 1;
      this.exerciseCounter = 1;
      this.setCounter = 1;
    }
  
    getDayId() {
      return this.dayCounter++;
    }
  
    getExerciseId() {
      return this.exerciseCounter++;
    }
  
    getSetId() {
      return this.setCounter++;
    }
  }
  
  // Export a singleton instance
  export const idGenerator = new IdGenerator();