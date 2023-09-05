<template>
  <div class="section hr b">
    <button
      class="button-with-icon"
      @click="
        $emit('update:modelValue', {
          family: editorStore.defaultFont.family,
          size: new Size(
            editorStore.defaultFont.size.v,
            editorStore.defaultFont.size.type
          ),
          is_auto: true,
          color: editorStore.defaultFont.color
        } as FontOption)
      "
    >
      <Lucide name="RefreshCcw"></Lucide>
    </button>
  </div>
  <div class="section hr">
    <CSSSizeInput
      @input="modelValue.is_auto = false"
      :title="'Rozmiar'"
      :size="modelValue.size"
    ></CSSSizeInput>
  </div>
  <div class="section hr">
    <h4>Rodzaj</h4>
    <div>
      <!-- <input @input="modelValue.is_auto=false" id="font-family" v-model="modelValue.family" /> -->
      <FontFamilyDropdownPicker
        @input="modelValue.is_auto = false"
        v-model="modelValue.family"
        :options="[
          { text: 'Times New Roman', val: 'Times New Roman' },
          { text: 'Arial', val: 'Arial' }
        ]"
      ></FontFamilyDropdownPicker>
    </div>
  </div>
  <div class="section hr">
    <label>
      <h4>Kolor</h4>
      <ColorPicker v-model="modelValue.color" @change="modelValue.is_auto = false"></ColorPicker>
    </label>
  </div>
  <!-- <div class="section hr">
      <button
        class="button-with-icon"
        v-if="modelValue != editorStore.defaultFont"
        @click="
          $emit('update:modelValue', {
            family: editorStore.defaultFont.family,
            size: new Size(
              editorStore.defaultFont.size.v,
              editorStore.defaultFont.size.type
            ),
            is_auto: true,
            color: editorStore.defaultFont.color
          } as FontOption)
        "
      >
        <IconRefreshCCW/> Domyślna czcionka
      </button>
    </div> -->
</template>

<script lang="ts" setup>
import { Size, FontOption, useEditorStore } from "@/stores/editor"
import Card from "@/components/Card.vue"
import CSSSizeInput from "@/components/input/CSSSizeInput.vue"
import ColorPicker from "@/components/input/ColorPicker.vue"
import FontFamilyDropdownPicker from "./FontFamilyDropdownPicker.vue"
import Lucide from "../icons/Lucide.vue"

const editorStore = useEditorStore()

const props = defineProps<{
  modelValue: FontOption
  title: string
}>()
</script>

<style scoped>
h3 {
  border-bottom: 2px solid var(--app-divider-color);
  margin-bottom: 0.5rem;
}
</style>
