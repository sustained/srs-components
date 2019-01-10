<template>
  <div>
    <h1>{{ thePrompt }}</h1>

    <p>Select the words to build the correct translation:</p>

    <ul id="user-choices">
      <li v-for="(choice, choiceIndex) in choices" :key="choiceIndex" @click="removeChoice(choice)">
        <span>{{ choice.id + 1 }}.</span>
        {{ choice.choice }}
      </li>
    </ul>

    <ul id="available-options">
      <li
        v-for="(option, optionIndex) in availableOptions"
        :key="optionIndex"
        @click="addChoice(option)"
      >
        <span>{{ option.id + 1 }}.</span>
        {{ option.choice }}
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
    this.$on("change", () => {
      this.checkForAnswer();
    });

    this.$event.$on("navigateNumerically", number => {
      this.addOrRemoveChoice(number);
    });
  },

  beforeDestroy() {
    this.$off("change");
    // this.$event.$off("navigateNumerically");
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

    checkForAnswer() {
      if (this.choices.length !== this.theAnswer.length) return false;

      let wasCorrect = false;

      for (let i = 0; i < this.theAnswer.length; i++) {
        wasCorrect = this.choices[i].choice === this.theAnswer[i];

        if (!wasCorrect) break;
      }

      if (!wasCorrect) return false;

      this.$emit("correct", {
        type: "select-words",
        correct: wasCorrect,
        choice: this.choices,
        answer: this.theAnswer,
        prompt: this.thePrompt
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

ul#available-options li {
  display: block;
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.2rem;
}

ul#user-choices {
  list-style-type: none;
  height: 60px;
  border: 1px solid black;
  margin-bottom: 20px;
}

ul#user-choices li {
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
