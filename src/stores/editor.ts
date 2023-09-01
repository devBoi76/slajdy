import { ref, computed, type Ref } from "vue"
import { defineStore } from "pinia"
import { pageCoordToCanvas } from "@/scripts/utility"

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const font_size_type = ["pt", "px", "rem", "auto"] as const
export type SizeType = (typeof font_size_type)[number]

export class Size {
  constructor(v: number, type: SizeType) {
    this._v = v
    this.type = type
  }
  _v: number
  type: SizeType
  get v() {
    return this.type == "auto" ? -1 : this._v
  }
  set v(v: number) {this._v = v}
  get string() {
    console.log(this.v, this.type)
    if (this.type != "auto") return `${this.v}${this.type}`
    else return `auto`
  }
}

export class FontOption {
  constructor(f?: FontOption) {
    this.family = f ? f.family : "Times"
    this.size = f ? new Size(f.size.v, f.size.type) : new Size(32, "pt")
    this.is_auto = f ? f.is_auto : true
    this.color = f ? f.color : "#000000"
  }
  
  family: string
  size: Size
  is_auto: boolean
  color: string
}

export interface CanvasColors {
  bg: string
}

const component_type = ["text", "image", "customhtml"] as const
export type ElementType = (typeof component_type)[number]

export class Vec2 {
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  x: number
  y: number
}

export interface ElementModel {
  id: number
  fancyquotes: boolean,
  type: ElementType
  value: string
  position: Vec2
  rect: () => DOMRect
  padding: Size
  width: Size
  height: Size
  dragged: boolean
  font: FontOption
}

export enum Orientation {
    Vertical,
    Horizontal
}

export enum DragGuideSource {
  Element = "#ee866d",
  Page = "lightblue"
}



export class DragGuide {
  constructor(v: number, t: DragGuideSource, o: Orientation, sourceID: number) {
    this.value = v
    this.type = t
    this.orientation = o
    this.sourceID = sourceID
  }

  get color() : string {
    return this.type
  }

  value: number
  orientation: Orientation
  type: DragGuideSource
  sourceID: number
}

export const useEditorStore = defineStore("editor", {
  state: () => {
    return {
      defaultFont: new FontOption(),

      canvasColors: {
        bg: "#ffffff"
      } as CanvasColors,

      selectedElementID: -1,
      draggedElementID: -1,
      nextID: 1,
      elements: defaultElements(),
      hDragGuides: [] as DragGuide[],
      vDragGuides: [] as DragGuide[],
      highlightedGuides: [] as DragGuide[],
      canvasRect: new DOMRect()
    }
  },
  getters: {
    selectedElement() : ElementModel | undefined {
      return this.elements.get(this.selectedElementID);
    }
  },

  actions: {
    deleteElement(id: number) {
      if (this.draggedElementID == id) this.setDragged(-1)
      if (this.selectedElementID == id) this.selectedElementID = -1

      this.elements.delete(id)
    },
    addElement(type: ElementType) {
      this.elements.set(this.nextID, {
        id: this.nextID,
        fancyquotes: type == "text" ? true : false,
        position: new Vec2(0.05, 0.05),
        rect: () => new DOMRect(),
        dragged: false,
        type: type,
        padding: new Size(0.25, "rem"),
        width: new Size(type=="text" ? -1 : 4, type=="text" ? "auto" : "rem"),
        height: new Size(0, "auto"),
        value: type == "text" ? "Wybierz aby edytować..." : "",
        font: new FontOption(this.defaultFont)
      })
      this.selectedElementID = this.nextID
      this.nextID += 1
    },

    getClosestHGuide(xx: number, filterfn: (g: DragGuide) => boolean) : DragGuide {

      return this.hDragGuides.sort( (a, b) => Math.abs(a.value - xx) - Math.abs(b.value - xx)).filter(v=>filterfn(v))[0]
    },

    getClosestVGuide(yy: number, filterfn: (g: DragGuide) => boolean) : DragGuide {

      return this.vDragGuides.sort( (a, b) => Math.abs(a.value - yy) - Math.abs(b.value - yy)).filter(v=>filterfn(v))[0]
    },
    getElementModel(id: number): ElementModel {
      if (!this.elements.has(id)) {
        console.error(`Unknown element id! (getElementModel): ${id}`)
      }
      return this.elements.get(id)!
    },

    setDragged(id: number) {
      console.log(id)
      

      if (this.draggedElementID != -1) {
        this.getElementModel(this.draggedElementID).dragged = false
      }
      this.gatherDragGuides()
      if (id == -1) {
      }
      this.draggedElementID = id
      if (id != -1) {
        this.getElementModel(id).dragged = true
      }

    },

    gatherDragGuides() {

      this.hDragGuides = [
        new DragGuide(0, DragGuideSource.Page, Orientation.Horizontal, -1),
        new DragGuide(0.5, DragGuideSource.Page, Orientation.Horizontal, -1),
        new DragGuide(1, DragGuideSource.Page, Orientation.Horizontal, -1)
      ]
      this.vDragGuides = [
        new DragGuide(0, DragGuideSource.Page, Orientation.Vertical, -1),
        new DragGuide(0.5, DragGuideSource.Page, Orientation.Vertical, -1),
        new DragGuide(1, DragGuideSource.Page, Orientation.Vertical, -1)
      ]

      for (const [id, el] of this.elements) {
        this.hDragGuides.push(new DragGuide(pageCoordToCanvas(
          el.rect().left,
          this.canvasRect.left,
          this.canvasRect.right
        ), DragGuideSource.Element, Orientation.Horizontal, el.id))
        this.hDragGuides.push(new DragGuide(pageCoordToCanvas(
          el.rect().right,
          this.canvasRect.left,
          this.canvasRect.right
        ), DragGuideSource.Element, Orientation.Horizontal, el.id))

        this.vDragGuides.push(new DragGuide(pageCoordToCanvas(
          el.rect().top,
          this.canvasRect.top,
          this.canvasRect.bottom
        ), DragGuideSource.Element, Orientation.Vertical, el.id))
        this.vDragGuides.push(new DragGuide(pageCoordToCanvas(
          el.rect().bottom,
          this.canvasRect.top,
          this.canvasRect.bottom
        ), DragGuideSource.Element, Orientation.Vertical, el.id))
      }
    }
  }
})

function defaultElements(): Map<number, ElementModel> {
  const map = new Map<number, ElementModel>()
  map.set(0, {
    id: 0,
    type: "text",
    fancyquotes: true,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: new Size(0.25, "rem"),
    width: new Size(0, "auto"),
    height: new Size(0, "auto"),
    position: new Vec2(0.05, 0.05),
    rect: () => new DOMRect(),
    font: new FontOption()
    })
  return map
}
