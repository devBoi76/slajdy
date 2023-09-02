<template>
  <div class="wrapper" :style="positionCss" ref="outer">
    <div
      class="outer"
      @click.stop="setActiveComponent"
      :class="{ active: isActive }"
      :style="model.type != 'image' ? stylingCSS : {lineHeight: '0'}"
    >
      <p
        :style="`color: ${model.font.color}`"
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
        @mousedown="editorStore.setDragged({sourceID: model.id, type: DraggedElementType.Move})"
      >
        <IconMove />
      </div>

      <div class="trash-button" v-if="isActive" @mousedown="deleteElement">
        <IconTrash />
      </div>
      <div class="expander-both" @mousedown="editorStore.setDragged({sourceID: model.id, type: DraggedElementType.ExpandXY})"></div>

      <div class="expander-bottom" @mousedown="editorStore.setDragged({sourceID: model.id, type: DraggedElementType.ExpandY})"></div>
      <div class="expander-right" @mousedown="editorStore.setDragged({sourceID: model.id, type: DraggedElementType.ExpandX})"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue"

import { useEditorStore, type ElementModel, Vec2, DraggedElementType } from "@/stores/editor"
import IconMove from "./icons/IconMove.vue"

import IconTrash from "./icons/IconTrash.vue"

export default defineComponent({
  name: "EditorElement",
  expose: ["boundingRect"],
  props: {
    model: {
      type: Object as PropType<ElementModel>,
      required: true
    },
    scale: {
      type: Number,
      required: true
    },
    shouldBind: {type: Boolean, required: true}
  },

  setup() {
    const editorStore = useEditorStore()
    return { editorStore: editorStore, DraggedElementType }
  },
  mounted() {
    if (this.shouldBind) {
      this.model.rect = (() =>
      (this.$refs.outer as HTMLDivElement).getBoundingClientRect()).bind(this)
      console.log(this.$refs, this.model.rect)
    }
  },
  methods: {
    setActiveComponent() {
      this.editorStore.selectedElementID = this.$props.model.id
    },
    // model {
    //   return this.editorStore.elements.get(this.model.id)!
    // },
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
        left: `calc(${this.model.position.x * 100}%)`,
        top: `calc(${this.model.position.y * 100}%)`,
        width: `calc(${this.model.width.string}*${this.model.width.scales ? this.scale : 1})`,
        height: `calc(${this.model.height.string}*${this.model.height.scales ? this.scale : 1})`,
      }
    },
    stylingCSS() {
      return {
        padding: `calc(${this.model.padding.string}*${this.model.padding.scales ? this.scale : 1})`,
        fontSize: 
          !this.model.font.is_auto
            ? `calc(${this.model.font?.size.string}*${this.scale})`
            : `calc(var(--font-size)*${this.scale})`
        ,
        fontFamily: `${
          !this.model.font.is_auto
            ? this.model.font?.family
            : "inherit"
        }`
      }
    }
  },
  components: { IconMove, IconTrash }
})
</script>

<style scoped>
.expander-right {
  z-index: 999;
  position: absolute;
  right: 0;
  top: 0;
  bottom: var(--sz);
  width: calc(var(--sz)/2);
}
.outer.active .expander-right:hover {
  cursor: e-resize;
  background-image: linear-gradient(to right, transparent, var(--app-accent-color-light))
}

.expander-bottom {
  z-index: 999;
  position: absolute;
  right: var(--sz);
  left: 0;
  bottom: 0;
  height: calc(var(--sz)/2);
}
.outer.active .expander-bottom:hover {
  cursor: s-resize;
  background-image: linear-gradient(to bottom, transparent, var(--app-accent-color-light))
}

.expander-both {
  z-index: 999;
  position: absolute;
  right: 0;
  bottom: 0;
  height: var(--sz);
  width: var(--sz);
}
.outer.active .expander-both:hover {
  cursor: se-resize;
  background-image: linear-gradient(to bottom right, transparent, var(--app-accent-color-light))
}

p {
  text-align: center;
  white-space: pre;
}

img {
  min-height: calc(4rem*v-bind(scale));
  min-width: calc(4rem*v-bind(scale));
  width: 100%;
  height: 100%;
}
img[src=""] {
  border: 2px solid red;
}

.wrapper {
  position: absolute;
  --sz: 2rem;
}
.outer {
  width: 100%;
  height: 100%;
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
