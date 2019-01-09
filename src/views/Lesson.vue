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

      <template v-if="currentExercise.type === 'choose-translation'">
        <lesson-choose-translation
          :prompt="currentExercise.prompt"
          :answer="currentExercise.answer"
          :options="currentExercise.choices"
          @correct="onAnswer"
          @incorrect="onAnswer"
        />
      </template>

      <template v-else-if="currentExercise.type === 'select-words'">
        <lesson-select-words
          :prompt="currentExercise.prompt"
          :answer="currentExercise.answer"
          :options="currentExercise.choices"
          @correct="onAnswer"
          @incorrect="onAnswer"
        />
      </template>
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
          choices: ["hund", "hus", "dog", "katt", "ond", "eller", "mus", "och"]
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
    }
  },

  components: {
    LessonComplete,
    LessonChooseTranslation,
    LessonSelectWords
  },

  mounted() {
    console.log("mount");
    window.addEventListener("keyup", this._keyupListener.bind(this));
  },

  unmounted() {
    console.log("unmount");
    window.removeEventListener("keyup", this._keyupListener.bind(this));
  },

  methods: {
    _keyupListener() {
      if (
        (event.keyCode >= 49 && event.keyCode <= 57) ||
        (event.keyCode >= 97 && event.keyCode <= 105)
      )
        this.$event.$emit("navigateNumeric", event.key);
    },

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
