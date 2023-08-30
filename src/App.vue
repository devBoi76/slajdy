<template>
  <div @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <Editor ref="editor"></Editor>
  </div>
</template>

<script lang="ts">
import Editor from "@/components/Editor.vue"
import { defineComponent, ref } from "vue"
import { useEditorStore } from "@/stores/editor"
import { pageCoordToCanvas } from "@/scripts/utility"


export default defineComponent({
  setup() {
    const editorStore = useEditorStore()

    const editor = ref<InstanceType<typeof Editor> | null>(null)

    return { editorStore, editor}
  },
  methods: {
    handleMouseMove(ev: MouseEvent) {
      if (this.editorStore.draggedElementID == -1) {
        return
      }

      const SNAP_DISTANCE = 0.01

      const ID = this.editorStore.draggedElementID
      const rect = this.editorStore.getElementModel(ID).rect()
      this.editorStore.highlightedGuides = []


      // Canvas-local pixel coords
      const xleft = pageCoordToCanvas(
        ev.pageX,
        this.editorStore.canvasRect.left,
        this.editorStore.canvasRect.right
      )
      const xright = pageCoordToCanvas(
        ev.pageX + rect.width,
        this.editorStore.canvasRect.left,
        this.editorStore.canvasRect.right
      )
      const xmid = pageCoordToCanvas(
        ev.pageX + rect.width/2,
        this.editorStore.canvasRect.left,
        this.editorStore.canvasRect.right
      )

      const closestGuidlineLeft = this.editorStore.getClosestHGuide(xleft)
      const closestGuidlineRight = this.editorStore.getClosestHGuide(xright)
      const closestGuidlineMidX = this.editorStore.getClosestHGuide(xmid)
      

      const x = (() => {
        const dleft = {d: Math.abs(closestGuidlineLeft.value - xleft), pos: closestGuidlineLeft.value, g: closestGuidlineLeft}
        const dright = {d: Math.abs(closestGuidlineRight.value - xright), pos: closestGuidlineRight.value - rect.width/this.editorStore.canvasRect.width, g: closestGuidlineRight}
        const dmid = {d: Math.abs(closestGuidlineMidX.value - xmid), pos: closestGuidlineMidX.value - rect.width/2/this.editorStore.canvasRect.width, g: closestGuidlineMidX}

        const min = [dleft, dright, dmid].sort((a, b) => a.d - b.d)[0]
        if (min.d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(min.g)
          return min.pos
        } else {
          return xleft
        }
      })()

      const ytop = pageCoordToCanvas(
        ev.pageY,
        this.editorStore.canvasRect.top,
        this.editorStore.canvasRect.bottom
      )
      const ybottom = pageCoordToCanvas(
        ev.pageY + rect.height,
        this.editorStore.canvasRect.top,
        this.editorStore.canvasRect.bottom
      )
      const ymid = pageCoordToCanvas(
        ev.pageY + rect.height/2,
        this.editorStore.canvasRect.top,
        this.editorStore.canvasRect.bottom
      )

      const closestGuidlineTop = this.editorStore.getClosestVGuide(ytop)
      const closestGuidlineBottom = this.editorStore.getClosestVGuide(ybottom)
      const closestGuidlineMidY = this.editorStore.getClosestVGuide(ymid)

      const y = (() => {
        const dtop = {d: Math.abs(closestGuidlineTop.value - ytop), pos: closestGuidlineTop.value, g: closestGuidlineTop}
        const dbottom = {d: Math.abs(closestGuidlineBottom.value - ybottom), pos: closestGuidlineBottom.value - rect.height/this.editorStore.canvasRect.height, g: closestGuidlineBottom}
        const dmid = {d: Math.abs(closestGuidlineMidY.value - ymid), pos: closestGuidlineMidY.value - rect.height/2/this.editorStore.canvasRect.height, g: closestGuidlineMidY}

        const min = [dtop, dbottom, dmid].sort((a, b) => a.d - b.d)[0]
        if (min.d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(min.g)
          return min.pos
        } else {
          return ytop
        }
      })()


      this.editorStore.getElementModel(
        this.editorStore.draggedElementID
      ).position.x = x
      this.editorStore.getElementModel(
        this.editorStore.draggedElementID
      ).position.y = y

      this.editor?.getCanvas().drawDragLines()
    },

    handleMouseUp(ev: MouseEvent) {
      this.editor?.getCanvas().drawDragLines()
      if (this.editorStore.draggedElementID != -1) {
        this.editorStore.setDragged(-1)
      }
    }
  },
  components: {
    Editor
  }
})
</script>

<style scoped></style>
