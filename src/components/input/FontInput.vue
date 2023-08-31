<template>
  <Card>
    <h3>{{ title }}</h3>
    <div class="section">
      <CSSSizeInput @input="modelValue.is_auto=false" :title="'Rozmiar'" :size="modelValue.size"></CSSSizeInput>
    </div>
    <div class="section">
      <h4>Rodzaj</h4>
      <div>
        <input @input="modelValue.is_auto=false" id="font-family" v-model="modelValue.family" />
      </div>
    </div>
    <div class="section">
      <label>
        Kolor Tekstu:
        <ColorPicker v-model="modelValue.color"></ColorPicker>
      </label>
    </div>
    <div class="section">
      <button v-if="modelValue != editorStore.defaultFont" @click="$emit('update:modelValue', {family: editorStore.defaultFont.family, size: new Size(editorStore.defaultFont.size.v, editorStore.defaultFont.size.type), is_auto: true, color: editorStore.defaultFont.color} as FontOption)">Resetuj czcionkę</button>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { Size, FontOption, useEditorStore } from "@/stores/editor"
import Card from "@/components/Card.vue"
import CSSSizeInput from "@/components/input/CSSSizeInput.vue";
import ColorPicker from "@/components/input/ColorPicker.vue";

const editorStore = useEditorStore()

const props = defineProps<{
  modelValue: FontOption,
  title: string
}>()

</script>


<style scoped>
h3 {
  border-bottom: 2px solid var(--app-divider-color);
  margin-bottom: 0.5rem;
}
</style>
