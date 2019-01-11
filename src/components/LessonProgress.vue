<template>
  <div id="lesson-progress" ref="progressOuter">
    <div id="lesson-progress-inner" class="animate-width" ref="progressInner"></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "LessonProgress",

  props: {
    currentExercise: Number,
    exerciseCount: Number,
    sessionEnded: Boolean
  },

  watch: {
    /**
     * Whenever the current exercise changes, update the progress bar width.
     */
    currentExercise(updated) {
      this.currentExercise = updated;
      const progressWidth = (this.currentExercise / this.exerciseCount) * 100;
      this.$refs.progressInner.style.width = progressWidth + "%";
    },

    // NOTE: Seems slightly hacky, perhaps there is a better way?
    sessionEnded(updated) {
      this.sessionEnded = updated;

      this.$refs.progressInner.style.width = this.sessionEnded ? "100%" : "0%";
    }
  }
};
</script>

<style scoped lang="scss">
div#lesson-progress {
  height: 20px;
  width: 85%;
  border: 1px solid black;
}

div#lesson-progress-inner {
  height: 20px;
  background-color: green;
  width: 0%;
}

.animate-width {
  transition: width 0.5s ease-in-out;
}
</style>
