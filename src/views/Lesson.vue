<template>
  <div>
    <template v-if="sessionEnded">
      <lesson-complete :session="session" @restart="resetSession"/>
    </template>

    <template v-else-if="sessionStarted">
      <p>
        <strong>Current Exercise:</strong>
        {{ currentExerciseIndex + 1 }} / {{ exerciseCount }}
      </p>

      <lesson-choose-translation
        :prompt="currentExercise.prompt"
        :answer="currentExercise.answer"
        :options="currentExercise.choices"
        @correct="onAnswer"
        @incorrect="onAnswer"
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

export default {
  name: "lesson",

  data() {
    return {
      delay: 1000,
      currentExerciseIndex: -1,
      sessionStarted: false,
      sessionEnded: false,
      session: [],
      exercises: [
        {
          id: 0,
          type: "choose-translation",
          prompt: "dog",
          answer: "hund",
          choices: ["hund", "katt", "mus"]
        },

        {
          id: 1,
          type: "choose-translation",
          prompt: "woman",
          answer: "kvinna",
          choices: ["pojke", "flicka", "man", "kvinna"]
        },

        {
          id: 2,
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
    }
  },

  components: {
    LessonComplete,
    LessonChooseTranslation
  },

  methods: {
    startSession() {
      this.sessionStarted = true;
      this.nextExercise();
    },

    resetSession() {
      this.session = [];
      this.sessionStarted = true;
      this.sessionEnded = false;
      this.currentExerciseIndex = 0;
    },

    addSessionEntry(wasCorrect, choice) {
      let entry = { choice: choice, wasCorrect: wasCorrect };
      this.session.push(entry);
    },

    nextExercise() {
      if (this.currentExerciseIndex + 1 === this.exerciseCount) {
        this.sessionEnded = true;
        this.sessionStarted = false;
        this.$emit("finish");
      } else {
        this.currentExerciseIndex++;
        this.$emit("change");
      }
    },

    onAnswer({ correct, choice }) {
      this.addSessionEntry(correct, choice);

      setTimeout(() => this.nextExercise(), this.delay);
    }
  }
};
</script>
