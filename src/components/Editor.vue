<template>
  <div class="wrapper">
    <EditorCanvas ref="veditorcanvas"></EditorCanvas>
    <div id="editor-page">
      <FontInput v-if="editorStore.selectedElement" :title="'Czcionka'"  v-model="editorStore.selectedElement.font"></FontInput>
      <FontInput v-else :title="'Domyślna czcionka'" v-model="editorStore.defaultFont"></FontInput>

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
            <ImagePickerModal ref="vimagepickermodal" v-model="editorStore.selectedElement.value" :default-image-sources="defaultImageSources"></ImagePickerModal>
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

// TODO: https://www.npmjs.com/package/html-to-image zapisywanie zdjęcia

<script setup lang="ts">
import EditorCanvas from "./EditorCanvas.vue"
import FontInput from "@/components/input/FontInput.vue"
import { useEditorStore } from "@/stores/editor";
import { defineComponent, nextTick, ref, type Ref } from "vue"
import Card from "./Card.vue";
import CSSSizeInput from "./input/CSSSizeInput.vue";
import ImagePicker from "./input/ImagePicker.vue";
import IconQuotes from "@/components/icons/IconQuotes.vue"
import Modal from "@/components/Modal.vue";
import ImagePickerModal from "./modals/ImagePickerModal.vue";


const veditorcanvas = ref<InstanceType<typeof EditorCanvas> | null>(null)
const vimagepickermodal = ref<InstanceType<typeof ImagePickerModal> | null>(null)

const editorStore = useEditorStore()
</script>


<script lang="ts">


export default defineComponent({
  expose: ["getCanvas"],
  methods: {
    getCanvas() : InstanceType<typeof EditorCanvas> {return this.$refs.veditorcanvas as InstanceType<typeof EditorCanvas>},
    getImagePickerModal() : InstanceType<typeof ImagePickerModal> {return this.$refs.vimagepickermodal as InstanceType<typeof ImagePickerModal>},
    fileToSRC(file: File) {return URL.createObjectURL(file)},
  },
  computed: {
    defaultImageSources() {
      // const r = await fetch(`https://api.unsplash.com/photos/random?count=${n}`)
      // const j = await r.json()
      // console.log(j)
      const imgs = []
      const n = 10
      for (let i = 0; i < n; i++) {
        imgs.push(`https://imgs.search.brave.com/0obG6rVTJLsFrFxA-zQH_z6FJ2BNfrpMDoIEJCwhlzQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzExLzM1LzU0/LzM2MF9GXzExMTM1/NTQ2OF9URXF1UE1n/dE5kaG8xTk1adTEy/Znl5V3hnUm5kWVpp/ci5qcGc`)
      }
      return imgs

    }
  }
})
</script>

<style scoped>
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
