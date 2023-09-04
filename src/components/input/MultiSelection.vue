<template>
  <div
    class="outer"
    :selected="modelValue == value"
    @click="$emit('update:modelValue', value)"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.outer {
  /* border: 2px solid var(--app-divider-color); */
  border-radius: calc(var(--app-border-radius) / 2);
  margin-block: 0.25rem;
  width: fit-content;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0 4px var(--app-text-color);
}

.outer:first-of-type {
  border-top-left-radius: var(--app-border-radius);
  border-top-right-radius: var(--app-border-radius);
}

.outer:last-of-type {
  border-bottom-left-radius: var(--app-border-radius);
  border-bottom-right-radius: var(--app-border-radius);
}

.outer[selected="true"] {
  /* border-color: var(--app-accent-color); */
}
</style>

<script setup lang="ts">
const props = defineProps<
  | {
      modelValue: string
      value: string
    }
  | {
      modelValue: number
      value: number
    }
>()

const emits = defineEmits<{
  (event: "update:modelValue", value: typeof props.modelValue): void
}>()
</script>
