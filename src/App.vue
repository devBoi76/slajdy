<template>
  <div @keydown.control="editorStore.gatherDragGuides()" @keyup.control="editorStore.gatherDragGuides()" tabindex="0" @mousemove="handleMouseMove($event, $event.ctrlKey)" @mouseup="handleMouseUp">
    <Editor ref="editor"></Editor>
  </div>
</template>

<script lang="ts">
import Editor from "@/components/Editor.vue"
import { defineComponent, ref } from "vue"
import { useEditorStore, DragGuide } from "@/stores/editor"
import { pageCoordToCanvas } from "@/scripts/utility"


export default defineComponent({
  setup() {
    const editorStore = useEditorStore()

    const editor = ref<InstanceType<typeof Editor> | null>(null)

    return { editorStore, editor}
  },
  methods: {
    handleMouseMove(ev: MouseEvent, snapToSelf: boolean) {
      if (this.editorStore.draggedElementID == -1) {
        return
      }

      const SNAP_DISTANCE = snapToSelf ? 0.015 : 0.01

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

      const filterfn = snapToSelf ? 
        (g: DragGuide) => g.sourceID == ID :
        (g: DragGuide) => g.sourceID != ID

      const closestGuidlineLeft = this.editorStore.getClosestHGuide(xleft, filterfn)
      const closestGuidlineRight = this.editorStore.getClosestHGuide(xright, filterfn)
      const closestGuidlineMidX = this.editorStore.getClosestHGuide(xmid, filterfn)
      

      const x = (() => {
        const dleft = {d: Math.abs(closestGuidlineLeft.value - xleft), pos: closestGuidlineLeft.value, g: closestGuidlineLeft}
        const dright = {d: Math.abs(closestGuidlineRight.value - xright), pos: closestGuidlineRight.value - rect.width/this.editorStore.canvasRect.width, g: closestGuidlineRight}
        const dmid = {d: Math.abs(closestGuidlineMidX.value - xmid), pos: closestGuidlineMidX.value - rect.width/2/this.editorStore.canvasRect.width, g: closestGuidlineMidX}

        const mins = [dleft, dright, dmid].sort((a, b) => a.d - b.d)
        if (!snapToSelf && mins[0].d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(mins[0].g)
          if (Math.abs(mins[1].d - mins[0].d) < 0.01) {
            this.editorStore.highlightedGuides.push(mins[1].g)
          }
          return mins[0].pos
        } else if (snapToSelf && mins[0].d <= SNAP_DISTANCE && mins[1].d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(mins[0].g)
          this.editorStore.highlightedGuides.push(mins[1].g)
          return mins[0].pos
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

      const closestGuidlineTop = this.editorStore.getClosestVGuide(ytop, filterfn)
      const closestGuidlineBottom = this.editorStore.getClosestVGuide(ybottom, filterfn)
      const closestGuidlineMidY = this.editorStore.getClosestVGuide(ymid, filterfn)

      const y = (() => {
        const dtop = {d: Math.abs(closestGuidlineTop.value - ytop), pos: closestGuidlineTop.value, g: closestGuidlineTop}
        const dbottom = {d: Math.abs(closestGuidlineBottom.value - ybottom), pos: closestGuidlineBottom.value - rect.height/this.editorStore.canvasRect.height, g: closestGuidlineBottom}
        const dmid = {d: Math.abs(closestGuidlineMidY.value - ymid), pos: closestGuidlineMidY.value - rect.height/2/this.editorStore.canvasRect.height, g: closestGuidlineMidY}

        const mins = [dtop, dbottom, dmid].sort((a, b) => a.d - b.d)
        if (!snapToSelf && mins[0].d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(mins[0].g)
          if (Math.abs(mins[1].d - mins[0].d) < 0.01) {
            this.editorStore.highlightedGuides.push(mins[1].g)
          }
          return mins[0].pos
        } else if (snapToSelf && mins[0].d <= SNAP_DISTANCE && mins[1].d <= SNAP_DISTANCE) {
          this.editorStore.highlightedGuides.push(mins[0].g)
          this.editorStore.highlightedGuides.push(mins[1].g)
          return mins[0].pos
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

      this.editor?.getCanvas().drawDragLines(snapToSelf ? ID : -1)
    },

    handleMouseUp(ev: MouseEvent) {
      this.editor?.getCanvas().drawDragLines(-1 )
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
