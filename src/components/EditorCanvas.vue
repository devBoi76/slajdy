<!-- <script setup lang="ts">
const editorStore = useEditorStore()


</script> -->

<template>
  <div id="canvas-wrapper">
    <div
      id="canvas"
      ref="vcanvasfield"
      :style="cssVars"
      @click="editorStore.selectedElementID = -1"
    >
      <canvas
        :width="canvasRect()?.width"
        :height="canvasRect()?.height"
        id="editor-canvas"
      ></canvas>
      <EditorElement
        v-for="[id, el] in model"
        :model="el"
        :scale="scale"
        :should-bind="!isPreview"
        :key="UID(el)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { toPng } from "html-to-image"

import {
  useEditorStore,
  DragGuideSource,
  Orientation,
  type ElementModel,
  UID
} from "@/stores/editor"
import EditorElement from "@/components/EditorElement.vue"

export default defineComponent({
  expose: ["drawDragLines", "getImageURI"],
  props: {
    isPreview: { type: Boolean, required: true },
    model: { type: Map<number, ElementModel>, required: true }
  },
  setup() {
    const editorStore = useEditorStore()

    const vcanvasfield = ref<InstanceType<typeof HTMLDivElement> | null>(null)

    return { editorStore: editorStore, vcanvasfield }
  },
  data() {
    return {
      scale: 1,
      UID: UID
    }
  },
  mounted() {
    this.scale = (this.canvasRect()?.width || 1920) / 1920
    console.log(this.scale)

    if (this.isPreview) {
      return
    }
    const obs = new ResizeObserver(() => {
      this.editorStore.canvasRect = this.canvasRect()!
      this.scale = this.canvasRect()!.width / 1920
      console.log(this.scale)
    })
    obs.observe(document.getElementById("canvas")!)
    this.editorStore.canvasRect = document
      .getElementById("editor-canvas")!
      .getBoundingClientRect()
  },
  methods: {
    async getImageURI(): Promise<string> {
      this.vcanvasfield?.style
      console.log(1920 / this.canvasRect()!.width)
      console.log(this.canvasRect()?.width)
      const promise = toPng(document.getElementById("canvas")!, {
        canvasHeight: 1080,
        canvasWidth: 1920
      })

      return promise
    },
    drawDragLines(idToShow: number) {
      const painter = (
        document.getElementById("editor-canvas") as HTMLCanvasElement
      ).getContext("2d")!

      painter.clearRect(
        0,
        0,
        this.editorStore.canvasRect.width + 2,
        this.editorStore.canvasRect.height + 2
      )

      // painter.setLineDash([8, 8])

      if (this.editorStore.draggedElementID) {
        painter.lineWidth = 1
        painter.strokeStyle = "black"

        for (const l of this.editorStore.hDragGuides) {
          if (l.type == DragGuideSource.Element && l.sourceID != idToShow)
            continue

          let lx = Math.round(l.value * this.editorStore.canvasRect.width)

          painter.strokeStyle = l.color
          painter.beginPath()
          painter.moveTo(lx, 0)
          painter.lineTo(lx, this.editorStore.canvasRect.height)
          painter.closePath()
          painter.stroke()
        }

        for (const l of this.editorStore.vDragGuides) {
          if (l.type == DragGuideSource.Element && l.sourceID != idToShow)
            continue

          let ly = Math.round(l.value * this.editorStore.canvasRect.height)
          painter.strokeStyle = l.color
          painter.beginPath()
          painter.moveTo(0, ly)
          painter.lineTo(this.editorStore.canvasRect.width, ly)
          painter.closePath()
          painter.stroke()
        }

        for (const l of this.editorStore.highlightedGuides) {
          painter.beginPath()

          switch (l.orientation) {
            case Orientation.Horizontal:
              let lx = Math.round(l.value * this.editorStore.canvasRect.width)
              painter.strokeStyle = "red"
              painter.moveTo(lx, 0)
              painter.lineTo(lx, this.editorStore.canvasRect.height)
              break
            case Orientation.Vertical:
              let ly = Math.round(l.value * this.editorStore.canvasRect.height)
              painter.strokeStyle = "blue"
              painter.moveTo(0, ly)
              painter.lineTo(this.editorStore.canvasRect.width, ly)
              break
          }

          painter.closePath()
          painter.stroke()
        }
      }
    },
    canvasRect() {
      return this.vcanvasfield?.getBoundingClientRect()
    }
  },
  computed: {
    cssVars() {
      return {
        "--bgcolor": 'var(--app-foreground-color)',
        "--font-family": this.editorStore.defaultFont.family,
        "--font-size":
          this.editorStore.defaultFont.size.v +
          this.editorStore.defaultFont.size.type
      }
    }
    // canvasCss() {
    //   return {
    //     width: `${Math.floor(
    //       this.vcanvasfield?.getBoundingClientRect().width!
    //     )}px`,
    //     height: `${Math.floor(
    //       this.vcanvasfield?.getBoundingClientRect().height!
    //     )}px`
    //   }
    // },
  },
  components: { EditorElement }
})
</script>

<style scoped>
#canvas {
  width: 100%;
  aspect-ratio: 1920/1080;
  background: var(--bgcolor);
  font-size: var(--font-size);
  font-family: var(--font-family);
  position: relative;
}

#canvas-wrapper {
  /* border: 2px solid var(--app-divider-color); */
  max-height: 90vh;
  margin-bottom: auto;
  margin-right: 4rem;
  aspect-ratio: 16/9;
  overflow: hidden;
  grid-area: canvas;
  margin-right: 4rem;
  margin-bottom: auto;
  border-radius: var(--app-border-radius);
}
header {
  display: flex;
  /* border: 1px solid orange; */
  justify-content: space-between;
}
.text {
  /* border: 1px solid blue; */
  display: flex;
  flex-direction: column;
}

main {
  /* border: 1px solid pink; */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.centered-text {
  margin: auto;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
