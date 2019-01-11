<template>
  <div>
    <lesson-progress
      :currentExercise="currentExerciseIndex"
      :exerciseCount="exerciseCount"
      :sessionEnded="sessionEnded"
    />

    <template v-if="sessionEnded">
      <lesson-complete :session="session" @restart="resetSession"/>
    </template>

    <template v-else-if="sessionStarted">
      <p>
        <strong>Current Exercise:</strong>
        {{ currentExerciseDisplay }}
      </p>

      <component
        ref="exercise"
        :is="'lesson-' + currentExercise.type"
        :prompt="currentExercise.prompt"
        :answer="currentExercise.answer"
        :options="currentExercise.choices"
        @correct="onAnswer"
        @incorrect="onAnswer"
        :key="'choose-translation-' + currentExerciseIndex"
      />
    </template>

    <template v-else>
      <button type="submit" @click="startSession">Start Learning</button>
    </template>
  </div>
</template>

<script>
import LessonComplete from "@/components/LessonComplete.vue";
import LessonChooseTranslation from "@/components/LessonChooseTranslation.vue";
import LessonSelectWords from "@/components/LessonSelectWords.vue";
import LessonProgress from "@/components/LessonProgress.vue";

export default {
  name: "lesson",

  data() {
    return {
      // NOTE: Temporarily disabled (works fine for "choose-translation" but not for "select-words".
      navigationBlocked: true, // Disable keyboard navigation after answering until the next exercise.

      sessionStarted: false,
      sessionEnded: false,
      session: [], // Track the user's answers - used at the end of the lesson.

      currentExerciseIndex: -1,

      exercises: [
        {
          type: "choose-translation",
          prompt: "dog",
          answer: "hund",
          choices: ["hund", "katt", "mus"]
        },

        {
          type: "choose-translation",
          prompt: "cat",
          answer: "katt",
          choices: ["hund", "katt", "mus"]
        },

        {
          type: "choose-translation",
          prompt: "and",
          answer: "och",
          choices: ["eller", "och", "men"]
        },

        {
          type: "select-words",
          prompt: "dog and cat",
          answer: ["hund", "och", "katt"],
          choices: [
            { id: 0, choice: "hund" },
            { id: 1, choice: "hus" },
            { id: 2, choice: "dog" },
            { id: 3, choice: "ond" },
            { id: 4, choice: "katt" },
            { id: 5, choice: "eller" },
            { id: 6, choice: "mus" },
            { id: 7, choice: "och" }
          ]
        },

        {
          type: "select-words",
          prompt: "man and woman",
          answer: ["man", "och", "kvinna"],
          choices: [
            { id: 0, choice: "man" },
            { id: 1, choice: "pojke" },
            { id: 2, choice: "flicka" },
            { id: 3, choice: "kvinna" },
            { id: 4, choice: "och" },
            { id: 5, choice: "eller" },
            { id: 6, choice: "men" }
          ]
        },

        {
          type: "choose-translation",
          prompt: "woman",
          answer: "kvinna",
          choices: ["pojke", "flicka", "man", "kvinna"]
        },

        {
          type: "choose-translation",
          prompt: "milk",
          answer: "mjölk",
          choices: ["bröd", "äpple", "vatten", "mjölk"]
        }
      ]
    };
  },

  computed: {
    exerciseCount() {
      return this.exercises.length;
    },

    currentExercise() {
      return this.exercises[this.currentExerciseIndex];
    },

    currentExerciseDisplay() {
      return this.currentExerciseIndex + 1 + " / " + this.exerciseCount;
    }
  },

  components: {
    LessonProgress,
    LessonComplete,
    LessonChooseTranslation,
    LessonSelectWords
  },

  mounted() {
    window.addEventListener("keyup", this._keyupListener);
  },

  beforeDestroy() {
    window.removeEventListener("keyup", this._keyupListener);
  },

  methods: {
    _keyupListener(event) {
      if (
        (event.keyCode >= 49 && event.keyCode <= 57) ||
        (event.keyCode >= 97 && event.keyCode <= 105)
      ) {
        if (!this.navigationBlocked) {
          this.$refs.exercise.navigateNumerically(event.key);

          if (this.currentExercise.type !== "select-words")
            this.navigationBlocked = true;
        }
      }
    },

    startSession() {
      this.sessionStarted = true;
      this.navigationBlocked = false;
      this.nextExercise();
    },

    resetSession() {
      this.session = [];
      this.sessionStarted = true;
      this.sessionEnded = false;
      this.navigationBlocked = false;
      this.currentExerciseIndex = 0;
    },

    addSessionEntry(answer) {
      this.session.push(answer);
    },

    nextExercise() {
      if (this.currentExerciseIndex + 1 === this.exerciseCount) {
        clearInterval(this.countdown);
        this.sessionEnded = true;
        this.sessionStarted = false;
        this.navigationBlocked = true;
        this.$emit("finish");
      } else {
        this.currentExerciseIndex++;
        this.navigationBlocked = false;
        this.$emit("change");
      }
    },

    onAnswer(answer) {
      this.addSessionEntry(answer);
      setTimeout(() => this.nextExercise(), this.nextExerciseDelay);
    }
  }
};
</script>

<style>
ul {
  padding: 0;
  margin: 0;
}
</style>
