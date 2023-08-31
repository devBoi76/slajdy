<template>
    <div class="wrapper">
      <div>
          <img class="showcase-image" :src="modelValue">
      </div>
      <button @click="vimagemodal?.open()">Wybierz zdjęcie</button>
  </div>

  <Modal ref="vimagemodal" :title="'Wybierz zdjęcie'">
    <div class="image-modal">
      <img
        class="default-image"
        v-for="source in defaultImageSources"
        :src="source"
        @click="updateImage(source)"
      />
      <!-- TODO: Replace ImagePicker with some kind of file icon + text "Wybierz z komputera" -->
      <ImagePicker @imageInput="(n: string) => {updateImage(n)}"></ImagePicker>
    </div>
  </Modal>

</template>

<script setup lang="ts">



const props = defineProps<{
    modelValue: string,
    defaultImageSources: string[]
}>()

const vimagemodal = ref<InstanceType<typeof Modal> | null>(null)

</script>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ImagePicker from "@/components/input/ImagePicker.vue"


export default defineComponent({
    methods: {
        updateImage(value: string) {
            (this.$refs.vimagemodal as InstanceType<typeof Modal>).close()
            this.$emit("update:modelValue", value)
        },
        open() {
          (this.$refs.vimagemodal as InstanceType<typeof Modal>).open()
        }
    }
})
</script>


<style scoped>

button {
  border-radius: 0;
}

.showcase-image {
    margin: auto;
    position: absolute;
    inset: 0;
    max-height: 100%;
}

.wrapper {
    
    width: 10rem;
    height: 10rem;

    border: 2px solid var(--app-divider-color);
    overflow:hidden;
    display: flex;
    flex-direction: column;
}

.wrapper > div {
    position: relative;
    flex-grow: 1;
}

.image-modal {
  display: grid;
  grid-template-columns: repeat(7, auto);
  justify-content: space-evenly;
  column-gap: 1rem;
  row-gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}
.default-image {
  height: 10rem;
  box-shadow: 0 0 0.25rem transparent;
  transition: box-shadow 150ms;
  cursor: pointer;
}
.default-image:hover {
  box-shadow: 0 0 0.25rem var(--app-accent-color);
}
</style>