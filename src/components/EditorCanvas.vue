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
        :width="editorStore.canvasRect.width"
        :height="editorStore.canvasRect.height"
        id="editor-canvas"
      ></canvas>
      <EditorElement
        v-for="[id, el] in editorStore.elements"
        :model="el"
        :key="id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { toPng } from "html-to-image"


import { useEditorStore, DragGuideSource, Orientation } from "@/stores/editor"
import EditorElement from "@/components/EditorElement.vue"

export default defineComponent({
  expose: ["drawDragLines", "getImageURI"],
  setup() {
    const editorStore = useEditorStore()

    const vcanvasfield = ref<InstanceType<typeof HTMLDivElement> | null>(null)

    return { editorStore: editorStore, vcanvasfield }
  },
  mounted() {
    this.editorStore.canvasRect = document
      .getElementById("editor-canvas")!
      .getBoundingClientRect()

    const obs = new ResizeObserver(() => {
      this.editorStore.canvasRect = document
        .getElementById("canvas")!
        .getBoundingClientRect()
    })

    obs.observe(document.getElementById("canvas")!)
  },
  methods: {
    async getImageURI() : Promise<string> {
      this.vcanvasfield?.style
      const promise = toPng(document.getElementById("canvas")!, {pixelRatio: 1920/this.canvasRect!.width})

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

      if (this.editorStore.draggedElementID != -1) {
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
    }
  },
  computed: {
    cssVars() {
      return {
        "--bgcolor": this.editorStore.canvasColors.bg,
        "--font-family": this.editorStore.defaultFont.family,
        "--font-size":
          this.editorStore.defaultFont.size.v +
          this.editorStore.defaultFont.size.type
      }
    },
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
    canvasRect() {
      return document.getElementById("canvas")?.getBoundingClientRect()
    }
  },
  components: { EditorElement }
})
</script>

<style scoped>
#canvas {
  width: 100%;
  height: 100%;
  background: var(--bgcolor);
  font-size: var(--font-size);
  font-family: var(--font-family);
  position: relative;
}

#canvas-wrapper {
  border: 2px solid var(--app-divider-color);
  margin: 1rem 4rem auto 1rem;
  aspect-ratio: 16/9;
  flex-grow: 1;
  overflow: hidden;
  grid-area: canvas;
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
