<template>
  <div>
    <template v-if="sessionEnded">
      <p>Lesson over!</p>

      <ul>
        <li
          v-for="(entry, index) in session"
          :key="index"
        >You wrote {{ entry.choice}} and were {{ entry.wasCorrect ? 'correct' : 'incorrect'}}</li>
      </ul>

      <p>
        <button type="submit" @click="resetSession">Try again?</button>
      </p>
    </template>

    <template v-else-if="sessionStarted">
      <p>
        <strong>Current Exercise:</strong>
        {{ currentExerciseIndex + 1 }} / {{ exerciseCount }}
      </p>

      <choose-translation
        :source="currentExercise.word"
        :correct="currentExercise.answer"
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
import ChooseTranslation from "@/components/LessonChooseTranslation.vue";

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
          word: "dog",
          answer: "hund",
          choices: ["hund", "katt", "mus"]
        },

        {
          id: 1,
          type: "choose-translation",
          word: "woman",
          answer: "kvinna",
          choices: ["pojke", "flicka", "man", "kvinna"]
        },

        {
          id: 2,
          type: "choose-translation",
          word: "milk",
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
    ChooseTranslation
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
