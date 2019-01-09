<template>
  <div>
    <p>Lesson over!</p>

    <ul>
      <li
        v-for="(entry, index) in session"
        :key="index"
      >You wrote {{ entry.choice}} and were {{ entry.wasCorrect ? 'correct' : 'incorrect'}}</li>
    </ul>

    <p>
      <button type="submit" @click="$emit('restart')">Try again?</button>
    </p>
  </div>
</template>

<script>
export default {
  props: ["session"],
  name: "lesson-ended"
};
</script>
