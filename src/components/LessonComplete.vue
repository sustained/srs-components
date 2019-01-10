<template>
  <div>
    <p>Lesson over!</p>

    <ul>
      <li v-for="(entry, index) in session" :key="index">{{ formatSessionEntry(entry) }}</li>
    </ul>

    <p>
      <button type="submit" @click="$emit('restart')">Try again?</button>
    </p>
  </div>
</template>

<script>
export default {
  props: ["session"],
  name: "lesson-ended",
  methods: {
    // TODO: Refactor, at some point? It works for now though.
    formatSessionEntry(entry) {
      let answer =
        entry.type === "select-words"
          ? entry.choice.map(e => e.choice).join(" ")
          : entry.choice;
      let adjective = entry.correct ? "correct" : "incorrect";

      return `For the prompt "${
        entry.prompt
      }", you selected "${answer}" and were ${adjective}!`;
    }
  }
};
</script>
