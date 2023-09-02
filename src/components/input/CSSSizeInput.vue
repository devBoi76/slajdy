<template>
  <h4 v-if="title">{{ title }}</h4>
  <input
    type="number"
    id="default-font-size"
    v-model="size.v"
    :step="(size.type == ('pt'||'px')) ? 1 : 0.1"
    v-show="size.type != 'auto'"
    @input="$emit('input')"
  />
  <select default="pt" v-model="size.type" @input="$emit('input')">
    <option v-for="opt in font_size_type" :value="opt" >{{ hidden_types?.includes(opt) ? "" : opt }}</option>
  </select>
</template>

<style scoped>
input[type="number"] {
  width: 4rem;
  height: 2rem;
  border-radius: var(--app-border-radius) 0 0 var(--app-border-radius);
  border: 2px solid var(--app-divider-color);
  border-right: none;
}

select {
  border-radius: 0 var(--app-border-radius) var(--app-border-radius) 0;
  border: 2px solid var(--app-divider-color);
  border-left: none;
  height: 2rem;
}
</style>

<script setup lang="ts">
import { font_size_type, type Size, type SizeType} from "@/stores/editor"

const props = defineProps<{
  title?: string,
  size: Size,
  hidden_types?: SizeType[]
}>()

const emits = defineEmits(["input"])
</script>
