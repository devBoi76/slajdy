<template>

  <div class="outer" :selected="modelValue == value" @click="$emit('update:modelValue', value)">
    <slot></slot>
  </div>

</template>

<style scoped>
.outer {
  border: 2px solid var(--app-divider-color);
}

.outer[selected=true] {
  border-color: var(--app-accent-color);
}
</style>



<script setup lang="ts">


const props = defineProps<
{
  modelValue: string
  value: string
}
| {
  modelValue: number
  value: number
}
>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: typeof props.modelValue): void
}>()
</script>
