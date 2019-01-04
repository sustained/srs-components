<template>
  <div>
    <h1>{{ sourceWord }}</h1>

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
  name: "ChooseTranslation",

  data() {
    return {
      guess: null,
      sourceWord: this.source,
      correctAnswer: this.correct,
      targetOptions: this.options,
      targetClasses: {}
    };
  },

  watch: {
    source(newSourceWord) {
      this.sourceWord = newSourceWord;
    },
    correct(newCorrectAnswer) {
      this.correctAnswer = newCorrectAnswer;
    },
    options(newTargetOptions) {
      this.targetOptions = newTargetOptions;
    }
  },

  mounted() {
    console.log("mounted");

    this.$parent.$on("change", () => {
      console.log("yup");
      this.guess = null;
    });
  },

  props: {
    source: String,
    correct: String,
    options: Array
  },

  methods: {
    isCorrect(option) {
      if (this.guess === option) return this.guess === this.correctAnswer;
      else if (this.guess !== null) return option === this.correctAnswer;
    },

    isIncorrect(option) {
      return this.guess === option && this.guess !== this.correctAnswer;
    },

    // createClasses() {
    //   this.targetOptions.forEach(option => {
    //     this.$set(this.targetClasses, option, []);
    //   });
    // },

    checkAnswer(option) {
      console.log(option, this.correctAnswer);

      this.guess = option;

      if (option === this.correctAnswer) {
        // this.setCorrect(option);
        this.$emit("correct", {
          correct: true,
          choice: option,
          source: this.sourceWord
        });
      } else {
        // this.setIncorrect(option);
        this.$emit("incorrect", {
          correct: false,
          choice: option,
          source: this.sourceWord
        });
      }
    },

    setCorrect(option) {
      // this.targetClasses[option].push("correct");
    },

    setIncorrect(option) {
      // this.targetClasses[option].push("incorrect");
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
