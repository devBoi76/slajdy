<template>
  <div class="wrapper" :style="positionCss" ref="outer">
    <div
      class="outer"
      @click.stop="setActiveComponent"
      :class="{ active: isActive }"
      :style="model.type != 'image' ? stylingCSS() : { lineHeight: '0' }"
    >
      <p
        v-if="model.type == 'text'"
        :style="`color: ${
          model.font.is_auto ? 'var(--font-color)' : model.font.color
        }`"
      >
        {{ model.fancyquotes ? "„" : "" }}
        {{ model.value }}
        {{ model.fancyquotes ? "”" : "" }}
      </p>
      <img
        v-if="model.type == 'image'"
        :src="model.value"
        :style="stylingCSS"
      />
      <p v-if="model.type != 'text' && model.type != 'image'">
        Unknown component type! `{{ model }}`
      </p>

      <div
        class="move-button"
        v-if="isActive"
        @mousedown="
          editorStore.setDragged({
            sourceID: model.id,
            type: DraggedElementType.Move
          })
        "
      >
        <Lucide :name="'Move'" />
      </div>

      <div class="trash-button" v-if="isActive" @mousedown="deleteElement">
        <Lucide :name="'Trash2'" />
      </div>
      <div
        v-if="model.type == 'image'"
        class="expander-both"
        @mousedown="
          editorStore.setDragged({
            sourceID: model.id,
            type: DraggedElementType.ExpandXY
          })
        "
      ></div>

      <div
        v-if="model.type == 'image'"
        class="expander-bottom"
        @mousedown="
          editorStore.setDragged({
            sourceID: model.id,
            type: DraggedElementType.ExpandY
          })
        "
      ></div>
      <div
        v-if="model.type == 'image'"
        class="expander-right"
        @mousedown="
          editorStore.setDragged({
            sourceID: model.id,
            type: DraggedElementType.ExpandX
          })
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from "vue"

import {
  useEditorStore,
  type ElementModel,
  Vec2,
  DraggedElementType
} from "@/stores/editor"
import Lucide from "./icons/Lucide.vue"

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
    shouldBind: { type: Boolean, required: true }
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
    },
    stylingCSS() {
      console.log(this.model, {
        padding: `calc(${this.model.padding.string}*${
          this.model.padding.scales ? this.scale : 1
        })`,
        fontSize: !this.model.font.is_auto
          ? `calc(${this.model.font.size.string}*${this.scale})`
          : `calc(var(--font-size)*${this.scale})`,
        fontFamily: `${
          !this.model.font.is_auto ? this.model.font?.family : "inherit"
        }`,
        fontStyle: this.model.italic ? "italic" : "normal",
        fontWeight: this.model.bold ? "bold" : "normal"
      })
      return {
        padding: `calc(${this.model.padding.string}*${
          this.model.padding.scales ? this.scale : 1
        })`,
        fontSize: !this.model.font.is_auto
          ? `calc(${this.model.font.size.string}*${this.scale})`
          : `calc(var(--font-size)*${this.scale})`,
        fontFamily: `${
          !this.model.font.is_auto ? this.model.font?.family : "inherit"
        }`,
        fontStyle: this.model.italic ? "italic" : "normal",
        fontWeight: this.model.bold ? "bold" : "normal"
      }
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
        width: `calc(${this.model.width.string}*${
          this.model.width.scales ? this.scale : 1
        })`,
        height: `calc(${this.model.height.string}*${
          this.model.height.scales ? this.scale : 1
        })`
      }
    }
  },
  emits: ["element:focusEditor"],
  components: { Lucide }
})
</script>

<style scoped>
.expander-right {
  /* z-index: 999; */
  position: absolute;
  right: -0.5rem;
  padding-right: 0.5rem;
  top: 0;
  bottom: var(--sz);
  width: calc(var(--sz) / 2);
}
.outer.active .expander-right:hover {
  cursor: e-resize;
  /* background-image: linear-gradient(to right, transparent, var(--app-accent-color-light)) */
  border-right: 2px solid var(--app-text-color);
}

.expander-bottom {
  /* z-index: 999; */
  position: absolute;
  right: var(--sz);
  left: 0;
  bottom: -0.5rem;
  padding-bottom: 0.5rem;
  height: calc(var(--sz) / 2);
}
.outer.active .expander-bottom:hover {
  cursor: s-resize;
  /* background-image: linear-gradient(to bottom, transparent, var(--app-accent-color-light)); */
  border-bottom: 2px solid var(--app-text-color);
  box-sizing: content-box;
}

.expander-both {
  /* z-index: 999; */
  position: absolute;
  right: -0.5rem;
  bottom: -0.5rem;
  height: var(--sz);
  width: var(--sz);
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  box-sizing: content-box;
}
.outer.active .expander-both:hover {
  cursor: se-resize;
  /* background-image: linear-gradient(to bottom right, transparent, var(--app-accent-color-light)) */
  border-right: 2px solid var(--app-text-color);
  border-bottom: 2px solid var(--app-text-color);
}

p {
  display: inline;
  text-align: center;
  white-space: pre;
  font-style: inherit;
  font-weight: inherit;
}

img {
  min-height: calc(4rem * v-bind(scale));
  min-width: calc(4rem * v-bind(scale));
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
  z-index: 1;
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
  z-index: 1;
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
