<template>
  <div>
    <h1>{{ thePrompt }}</h1>

    <p>Pick the correct translation:</p>

    <ul>
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="checkAnswer(option)"
        :class="{ correct: isCorrect(option), incorrect: isIncorrect(option) }"
      >
        <span>{{ index + 1 }}.</span>
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "LessonChooseTranslation",

  props: {
    prompt: String,
    answer: String,
    options: Array
  },

  data() {
    return {
      guess: null,
      thePrompt: this.prompt,
      theAnswer: this.answer,
      theOptions: this.options
    };
  },

  watch: {
    prompt(newPrompt) {
      this.thePrompt = newPrompt;
    },
    answer(newAnswer) {
      this.theAnswer = newAnswer;
    },
    options(newOptions) {
      this.theOptions = newOptions;
    }
  },

  mounted() {
    this.$parent.$on("change", () => (this.guess = null));
  },

  methods: {
    isCorrect(option) {
      if (this.guess === option) return this.guess === this.theAnswer;
      else if (this.guess !== null) return option === this.theAnswer;
    },

    isIncorrect(option) {
      return this.guess === option && this.guess !== this.theAnswer;
    },

    checkAnswer(option) {
      this.guess = option;

      let wasCorrect = option === this.theAnswer;
      let eventName = wasCorrect ? "correct" : "incorrect";

      this.$emit(eventName, {
        correct: wasCorrect,
        choice: option,
        answer: this.theAnswer,
        prompt: this.sourceWord
      });
    }
  }
};
</script>

<style scoped lang="scss">
ul li {
  display: block;
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

.correct {
  background-color: green;
}

.incorrect {
  background-color: red;
}
</style>
