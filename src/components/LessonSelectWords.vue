<template>
  <div @keyup.up.native="numberKeyWasPressed">
    <h1>{{ thePrompt }}</h1>

    <p>Select the words to build the correct translation:</p>

    <ul id="selected-words">
      <li
        v-for="(choice, choiceIndex) in choices"
        :key="choiceIndex"
        @click="removeChoice(choice)"
      >{{ choice }}</li>

      <br style="clear: both;">
    </ul>

    <ul id="choices">
      <li v-for="(option, index) in availableOptions" :key="index" @click="addChoice(option)">
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
    answer: Array,
    options: Array
  },

  data() {
    return {
      listeners: {
        change: null,
        navigateNumeric: null
      },
      choices: [],
      thePrompt: this.prompt,
      theAnswer: this.answer,
      theOptions: this.options
    };
  },

  computed: {
    availableOptions() {
      return this.theOptions.filter(
        option => this.choices.indexOf(option) === -1
      );
    }
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

  created() {
    this.$parent.$on("change", () => (this.guess = null));

    console.log("hai");
    this.$event.$on("navigateNumeric", number => {
      this.addOrRemoveChoice(number);
    });
  },

  beforeDestroy() {
    this.$parent.$off("change");
    this.$event.$off("navigateNumeric");

    // this.listeners.change = this.listeners.navigateNumeric = null;
  },

  methods: {
    numberKeyWasPressed() {
      alert("yeay");
    },

    addChoice(added) {
      this.choices.push(added);
      this.$emit("change", { added });
    },

    removeChoice(removed) {
      this.choices.splice(this.choices.indexOf(removed), 1);
      this.$emit("change", { removed });
    },

    addOrRemoveChoice(index) {
      if (index < 0 || index > this.theOptions.length) return;

      const choice = this.theOptions[index - 1];

      console.log("add or remove " + choice);

      if (this.choices.indexOf(choice) === -1) this.addChoice(choice);
      else this.removeChoice(choice);
    },

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
ul {
  padding: 0;
  margin: 0;
}

ul#choices li {
  display: block;
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

ul#selected-words {
  list-style-type: none;
  height: 60px;
  border: 1px solid black;
  margin-bottom: 20px;
}

ul#selected-words li {
  margin: 10px;
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
  float: left;
}

.correct {
  background-color: green;
}

.incorrect {
  background-color: red;
}
</style>
