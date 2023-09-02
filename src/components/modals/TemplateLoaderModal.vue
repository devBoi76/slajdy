<template>
  <Modal
    :is-open="isOpen"
    :title="'Wybierz szablon'"
    @update:is-open="(v) => $emit('update:isOpen', v)"
  >
    <div class="template-modal">
        <EditorCanvas
        :model="t(id).map"
        :is-preview="true"
        v-for="t, id in templates"
        @click.capture="editorStore.setTemplate(t(id)); $emit('update:isOpen', false)"
        >
        </EditorCanvas>
    </div>
  </Modal>
</template>

<style scoped>
    #canvas-wrapper {
        display: inline-block;
        grid-area: unset;
        margin: 0;
        margin-inline: 1rem;
        border: none;
        transition: box-shadow 150ms;
        box-shadow: 0 0 0.25rem var(--app-accent-color-light);
        border-radius: 0.5rem;
        cursor: pointer;
        padding: 0.25rem;
    }

    #canvas-wrapper:hover {
        box-shadow: 0 0 0.5rem var(--app-accent-color);
    }
    .template-modal {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
    }
</style>

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
