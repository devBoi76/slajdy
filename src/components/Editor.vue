<template>
  <div class="wrapper">
    <EditorCanvas ref="veditorcanvas"></EditorCanvas>
    <div id="editor-page">
      <FontInput v-if="editorStore.selectedElement" v-model="editorStore.selectedElement.font"></FontInput>
      <FontInput v-else v-model="editorStore.defaultFont"></FontInput>

        <Card v-if="editorStore.selectedElementID != -1">
          <div class="section" v-if="editorStore.selectedElement?.type == 'text'">
            <h4>Tekst</h4>
            <textarea v-model="editorStore.selectedElement!.value"></textarea>
            <hr>
            <label>
              Cudzysłów:
              <input id="fancyquotes-check" type="checkbox" v-model="editorStore.selectedElement.fancyquotes">
            </label>
            <hr>
          </div>
          <div class="section" v-if="editorStore.selectedElement?.type == 'image'">
            <h4>Zdjęcie</h4>
            <!-- <input  type="file" accept="image/*" multiple="false" v-on:change=" (ev) => {editorStore.selectedElement.value = fileToSRC((ev.target as HTMLInputElement).files![0])}"> -->
            <ImagePicker v-model="editorStore.selectedElement!.value"></ImagePicker>
          </div>
          <div class="section">
            <CSSSizeInput :hidden_types="['auto']" :title="'Odstęp'" :size="editorStore.getElementModel(editorStore.selectedElementID).padding"></CSSSizeInput>
          </div>

          <div class="section">
            <CSSSizeInput :title="'Szerokość'" :size="editorStore.getElementModel(editorStore.selectedElementID).width"></CSSSizeInput>
            <CSSSizeInput :title="'Wysokość'" :size="editorStore.getElementModel(editorStore.selectedElementID).height"></CSSSizeInput>
          </div>
        </Card>

      <Card>
        <button @click="editorStore.addElement(`text`)">Dodaj tekst</button>
        <button @click="editorStore.addElement(`image`)">Dodaj zdjęcie</button>
      </Card>
    </div>
  </div>
</template>



<script setup lang="ts">
import EditorCanvas from "./EditorCanvas.vue"
import FontInput from "@/components/FontInput.vue"
import { useEditorStore } from "@/stores/editor";
import { defineComponent, ref, type Ref } from "vue"
import Card from "./Card.vue";
import CSSSizeInput from "./CSSSizeInput.vue";
import ImagePicker from "./ImagePicker.vue";
import IconQuotes from "@/components/icons/IconQuotes.vue"


const veditorcanvas = ref<InstanceType<typeof EditorCanvas> | null>(null)
const editorStore = useEditorStore()
</script>


<script lang="ts">


export default defineComponent({
  expose: ["getCanvas"],
  methods: {
    getCanvas() : InstanceType<typeof EditorCanvas> {console.log("here");return this.$refs.veditorcanvas as InstanceType<typeof EditorCanvas>},
    fileToSRC(file: File) {return URL.createObjectURL(file)}
  }
})
</script>

<style>
.wrapper {
  display: flex;
}

#editor-page {
  margin: 4rem 4rem 0 0;
  font-size: 1.3rem;
}

textarea {
  height: 5rem;
  width: 100%;
  resize: vertical;
}

label > * {
  margin-left: 0.25rem;
}

button {
  margin-right: 0.5rem;
}
</style>
