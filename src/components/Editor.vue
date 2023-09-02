<template>
  <div class="wrapper">
    <EditorCanvas ref="veditorcanvas"></EditorCanvas>

    <div id="editor-topbar">
      <div class="topbar">
        <div class="section hr b">
          <button
            class="button-with-icon"
            @click="saveBase64AsFile(veditorcanvas!.getImageURI(), 'slajd.png')"
          >
            <IconSave /> Zapisz zdjęcie
          </button>

          <button
            class="button-with-icon"
            @click="editorStore.addElement(`text`)"
          >
            <IconType /> Dodaj tekst
          </button>
          <button
            class="button-with-icon"
            @click="editorStore.addElement(`image`)"
          >
            <IconImage /> Dodaj zdjęcie
          </button>
        </div>

        <InlineFontInput v-if="editorStore.selectedElement?.type == 'text'"
        :title="'Czcionka'"
        v-model="editorStore.selectedElement.font"></InlineFontInput>
        <InlineFontInput v-else-if="editorStore.selectedElement?.type != 'image'"
        :title="'Domyślna czcionka'"
        v-model="editorStore.defaultFont"></InlineFontInput>
        <!-- <label v-if="editorStore.selectedElement"> -->
          <ButtonCheckbox v-if="editorStore.selectedElement" v-model="editorStore.selectedElement.fancyquotes">
              Cudzysłów
          </ButtonCheckbox>
          <!-- <input
                id="fancyquotes-check"
                type="checkbox"
                v-model="editorStore.selectedElement.fancyquotes"
              />
        </label> -->
      </div>
    </div>

    <div id="editor-page">
      <!-- <FontInput
        v-if="editorStore.selectedElement?.type == 'text'"
        :title="'Czcionka'"
        v-model="editorStore.selectedElement.font"
      ></FontInput>
      <FontInput
        v-else-if="editorStore.selectedElement?.type != 'image'"
        :title="'Domyślna czcionka'"
        v-model="editorStore.defaultFont"
      ></FontInput> -->

      <Card v-if="editorStore.selectedElementID != -1">
        <div class="section" v-if="editorStore.selectedElement?.type == 'text'">
          <h4>Tekst</h4>
          <textarea v-model="editorStore.selectedElement!.value"></textarea>
          <hr />
          <hr />
        </div>
        <div
          class="section"
          v-if="editorStore.selectedElement?.type == 'image'"
        >
          <h4>Zdjęcie</h4>
          <ImagePickerModal
            ref="vimagepickermodal"
            v-model="editorStore.selectedElement.value"
            :default-image-sources="defaultImageSources"
          ></ImagePickerModal>
        </div>
        <div class="section">
          <CSSSizeInput
            :hidden_types="['auto']"
            :title="'Odstęp'"
            :size="
              editorStore.getElementModel(editorStore.selectedElementID).padding
            "
          ></CSSSizeInput>
        </div>

        <div class="section">
          <CSSSizeInput
            :title="'Szerokość'"
            :size="
              editorStore.getElementModel(editorStore.selectedElementID).width
            "
          ></CSSSizeInput>
          <CSSSizeInput
            :title="'Wysokość'"
            :size="
              editorStore.getElementModel(editorStore.selectedElementID).height
            "
          ></CSSSizeInput>
        </div>
      </Card>
    </div>
  </div>
</template>

// TODO: https://www.npmjs.com/package/html-to-image zapisywanie zdjęcia

<script setup lang="ts">
import EditorCanvas from "./EditorCanvas.vue"
import FontInput from "@/components/input/FontInput.vue"
import { useEditorStore } from "@/stores/editor"
import { defineComponent, nextTick, ref, type Ref } from "vue"
import Card from "./Card.vue"
import CSSSizeInput from "./input/CSSSizeInput.vue"
import ImagePicker from "./input/ImagePicker.vue"
import IconQuotes from "@/components/icons/IconQuotes.vue"
import Modal from "@/components/Modal.vue"
import ImagePickerModal from "./modals/ImagePickerModal.vue"
import IconSave from "./icons/IconSave.vue"
import IconType from "./icons/IconType.vue"
import IconImage from "./icons/IconImage.vue"
import { images } from "@/scripts/images"
import InlineFontInput from "@/components/input/InlineFontInput.vue"
import ButtonCheckbox from "./input/ButtonCheckbox.vue"

const veditorcanvas = ref<InstanceType<typeof EditorCanvas> | null>(null)
const vimagepickermodal = ref<InstanceType<typeof ImagePickerModal> | null>(
  null
)

const editorStore = useEditorStore()
</script>

<script lang="ts">
export default defineComponent({
  expose: ["getCanvas"],
  methods: {
    getCanvas(): InstanceType<typeof EditorCanvas> {
      return this.$refs.veditorcanvas as InstanceType<typeof EditorCanvas>
    },
    getImagePickerModal(): InstanceType<typeof ImagePickerModal> {
      return this.$refs.vimagepickermodal as InstanceType<
        typeof ImagePickerModal
      >
    },
    fileToSRC(file: File) {
      return URL.createObjectURL(file)
    },
    async saveBase64AsFile(base64: Promise<string>, fileName: string) {
      var link = document.createElement("a")
      link.id = "janky-download-link"
      document.body.appendChild(link) // for Firefox

      link.setAttribute("href", await base64)
      link.setAttribute("download", fileName)
      link.click()
      document.getElementById("janky-download-link")?.remove()
    }
  },
  computed: {
    defaultImageSources() {
      // const r = await fetch(`https://api.unsplash.com/photos/random?count=${n}`)
      // const j = await r.json()
      // console.log(j)
      const imgs = images
      const n = 10
      for (let i = 0; i < n; i++) {
        imgs.push(
          `https://imgs.search.brave.com/0obG6rVTJLsFrFxA-zQH_z6FJ2BNfrpMDoIEJCwhlzQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzExLzM1LzU0/LzM2MF9GXzExMTM1/NTQ2OF9URXF1UE1n/dE5kaG8xTk1adTEy/Znl5V3hnUm5kWVpp/ci5qcGc`
        )
      }
      return imgs
    }
  }
})
</script>

<style>
.button-with-icon {
  display: inline-flex;
  /* align-items: center; */
  font-size: 1rem;
  justify-content: space-between;
  margin-inline: 0.15rem;
  gap: 0.25rem;
}
</style>

<style scoped>
.section.hr.b {
  border-right: 1px solid var(--app-divider-color);
  padding-right: 0.75rem;
}

/* .button-with-icon:first-of-type {
  border-top-left-radius: var(--app-border-radius);
  border-top-right-radius: var(--app-border-radius);
}
.button-with-icon:last-of-type {
  border-bottom-left-radius: var(--app-border-radius);
  border-bottom-right-radius: var(--app-border-radius); 
} */

.wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "topbar topbar"
    "canvas sidebar";
}

#editor-topbar {
  grid-area: topbar;
}

.topbar {
  background-color: var(--app-foreground-color);
  padding: 1rem;
  display: flex;
  align-items: end;
  gap: 0.75rem;
}

#editor-page {
  margin: 4rem 4rem 0 0;
  font-size: 1.3rem;
  grid-area: sidebar;
}

textarea {
  height: 5rem;
  width: 100%;
  resize: vertical;
}

label > * {
  margin-left: 0.25rem;
}

</style>
