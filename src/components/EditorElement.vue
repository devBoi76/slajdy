<template>
  <div class="wrapper" :style="positionCss" ref="outer">
    <div
      class="outer"
      @click.stop="setActiveComponent"
      :class="{ active: isActive }"
      :style="model.type != 'image' ? stylingCSS : {lineHeight: '0'}"
    >
      <p
        :style="`color: ${thisElement().font.color}`"
        v-if="model.type == 'text'"
      >
        {{ model.fancyquotes ? "„" : "" }}{{ model.value
        }}{{ model.fancyquotes ? "”" : "" }}
      </p>
      <img v-else-if="model.type == 'image'" :src="model.value" :style="stylingCSS"/>
      <p v-else>Unknown component type! `{{ model }}`</p>

      <div
        class="move-button"
        v-if="isActive"
        @mousedown="editorStore.setDragged(model.id)"
      >
        <IconMove />
      </div>

      <div class="trash-button" v-if="isActive" @mousedown="deleteElement">
        <IconTrash />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue"

import { useEditorStore, type ElementModel, Vec2 } from "@/stores/editor"
import IconMove from "./icons/IconMove.vue"

import IconTrash from "./icons/IconTrash.vue"

export default defineComponent({
  name: "EditorElement",
  expose: ["boundingRect"],
  props: {
    model: {
      type: Object as PropType<ElementModel>,
      required: true
    }
  },

  setup() {
    const editorStore = useEditorStore()
    return { editorStore: editorStore }
  },
  mounted() {
    this.editorStore.getElementModel(this.model.id).rect = () =>
      (this.$refs.outer as HTMLDivElement).getBoundingClientRect()
  },
  methods: {
    setActiveComponent() {
      this.editorStore.selectedElementID = this.$props.model.id
    },
    thisElement() {
      return this.editorStore.elements.get(this.model.id)!
    },
    deleteElement() {
      this.editorStore.deleteElement(this.model.id)
    }
  },
  computed: {
    isActive() {
      return this.editorStore.selectedElementID == this.$props.model.id
    },

    positionCss() {
      return {
        left: `calc(${this.thisElement().position.x * 100}%)`,
        top: `calc(${this.thisElement().position.y * 100}%)`
      }
    },
    stylingCSS() {
      return {
        padding: `${this.thisElement().padding.string}`,
        width: `${this.thisElement().width.string}`,
        height: `${this.thisElement().height.string}`,
        fontSize: 
          !this.thisElement().font.is_auto
            ? `calc(${this.thisElement().font?.size.string}*${this.editorStore.canvasRect.width/1920})`
            : `calc(var(--font-size)*${this.editorStore.canvasRect.width/1920})`
        ,
        fontFamily: `${
          !this.thisElement().font.is_auto
            ? this.thisElement().font?.family
            : "inherit"
        }`,
        boxSizing: "content-box" as const
      }
    }
  },
  components: { IconMove, IconTrash }
})
</script>

<style scoped>
p {
  text-align: center;
}

img {
  min-height: 4rem;
  min-width: 4rem;
  width: 100%;
}

.wrapper {
  position: absolute;
  --sz: 2rem;
}
.outer {
  width: fit-content;
  position: relative;
}
.move-button {
  position: absolute;
  top: -1rem;
  left: -1rem;
  border-radius: 100%;
  background-color: var(--app-background-color);
  aspect-ratio: 1/1;
  border: 2px solid var(--app-accent-color);
  z-index: 999;
  width: var(--sz);
  height: var(--sz);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
}

.trash-button {
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 100%;
  background-color: var(--app-background-color);
  aspect-ratio: 1/1;
  border: 2px solid red;
  z-index: 999;
  width: var(--sz);
  height: var(--sz);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.active {
  outline: 2px dashed var(--app-accent-color);
  user-select: none;
}
</style>
