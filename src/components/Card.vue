<template>
  <div class="card">
    <slot> </slot>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--app-border-radius);
  background-color: var(--app-foreground-color);
  margin-bottom: 1rem;
  border: 2px solid var(--app-divider-color);
  width: 20rem;
  padding: 1rem;
}
</style>
