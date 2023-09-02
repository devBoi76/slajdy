<template>
  <Modal
    :is-open="isOpen"
    :title="'Wybierz template'"
    @update:is-open="(v) => $emit('update:isOpen', v)"
  >
    <EditorCanvas
      :model="t(id).map"
      :is-preview="true"
      v-for="t, id in templates"
      @click.capture="editorStore.setTemplate(t(id)); $emit('update:isOpen', false)"
      style="height: 15rem;"
    >
    </EditorCanvas>
  </Modal>
</template>

<script setup lang="ts">
import { templates, useEditorStore } from "@/stores/editor"
import EditorCanvas from "@/components/EditorCanvas.vue"
import Modal from "../Modal.vue"

const props = defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits<{
  (e: "update:isOpen", value: boolean): void
}>()

const editorStore = useEditorStore()
</script>
