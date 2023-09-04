import { ref, computed, type Ref } from "vue"
import { defineStore } from "pinia"
import { pageCoordToCanvas } from "@/scripts/utility"
import { images } from "@/scripts/images"

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const font_size_type = ["pt", "%", "rem", "auto"] as const
export type SizeType = (typeof font_size_type)[number]

type ArraySize = {_v: number, type: SizeType}

export class Size {
  constructor(v: number, type: SizeType) {
      this._v = v
      this.type = type
  }

  static from_array(v: ArraySize): Size {
    return new Size(v._v, v.type)
  }
  _v: number
  type: SizeType
  get v() {
    return this.type == "auto" ? -1 : this._v
  }
  set v(v: number) {
    this._v = v
  }
  get string() : string {
    console.log(this.v, this.type)
    if (this.type != "auto") return `${this.v}${this.type}`
    else return `auto`
  }

  get scales() {
    return this.type != "%"
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

export type ElementModel = {
  id: number
  UID: number
  fancyquotes: boolean
  bold: boolean
  italic: boolean
  type: ElementType
  value: string
  position: Vec2
  rect: () => DOMRect | null
  padding: Size
  width: Size
  height: Size
  dragged: boolean
  font: FontOption
}

export function UID(el: ElementModel): string {
  return `${el.UID}`
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

  get color(): string {
    return this.type
  }

  value: number
  orientation: Orientation
  type: DragGuideSource
  sourceID: number
}

export enum DraggedElementType {
  Move,
  ExpandX,
  ExpandY,
  ExpandXY
}

export type DraggedElement = {
  sourceID: number
  type: DraggedElementType
} | null

export type ColorThemes = "light" | "reading" | "dark"

export const useEditorStore = defineStore("editor", {
  state: () => {
    return {
      defaultFont: new FontOption(),
      colorTheme: "light" as ColorThemes,
      canvasColors: {
        bg: "#ffffff"
      } as CanvasColors,

      selectedElementID: -1,
      draggedElementID: null as DraggedElement,
      nextID: 1,
      elements: defaultElements(),
      hDragGuides: [] as DragGuide[],
      vDragGuides: [] as DragGuide[],
      highlightedGuides: [] as DragGuide[],
      canvasRect: new DOMRect()
    }
  },
  getters: {
    selectedElement(): ElementModel | undefined {
      return this.elements.get(this.selectedElementID)
    },
    saveableElements(): Array<ElementModel> {
      return Array.from(this.elements.values())
    }
  },

  actions: {
    setColorTheme(t: ColorThemes) {
      document.body.className = t
      this.colorTheme = t
    },
    setTemplate(t: TemplateT) {
      this.elements = t.map
      this.nextID = t.nextID
      this.selectedElementID = -1
      this.draggedElementID = null
      console.log("foo", this)
    },
    deleteElement(id: number) {
      if (this.draggedElementID?.sourceID == id) this.setDragged(null)
      if (this.selectedElementID == id) this.selectedElementID = -1

      this.elements.delete(id)
    },
    addElement(type: ElementType) {
      this.elements.set(this.nextID, {
        id: this.nextID,
        UID: 0,
        fancyquotes: type == "text" ? true : false,
        bold: false,
        italic: false,
        position: new Vec2(0.05, 0.05),
        rect: () => new DOMRect(),
        dragged: false,
        type: type,
        padding: new Size(0.25, "rem"),
        width: new Size(
          type == "text" ? -1 : 8,
          type == "text" ? "auto" : "rem"
        ),
        height: new Size(0, "auto"),
        value: type == "text" ? "Wybierz aby edytować..." : "",
        font: new FontOption(this.defaultFont)
      })
      this.selectedElementID = this.nextID
      this.nextID += 1
    },

    getClosestHGuide(
      xx: number,
      filterfn: (g: DragGuide) => boolean
    ): DragGuide {
      return this.hDragGuides
        .sort((a, b) => Math.abs(a.value - xx) - Math.abs(b.value - xx))
        .filter((v) => filterfn(v))[0]
    },

    getClosestVGuide(
      yy: number,
      filterfn: (g: DragGuide) => boolean
    ): DragGuide {
      return this.vDragGuides
        .sort((a, b) => Math.abs(a.value - yy) - Math.abs(b.value - yy))
        .filter((v) => filterfn(v))[0]
    },
    getElementModel(id: number): ElementModel {
      if (!this.elements.has(id)) {
        console.error(`Unknown element id! (getElementModel): ${id}`)
      }
      return this.elements.get(id)!
    },

    setDragged(id: DraggedElement) {
      console.log(id)

      if (this.draggedElementID) {
        this.getElementModel(this.draggedElementID.sourceID).dragged = false
      }
      this.gatherDragGuides()

      this.draggedElementID = id
      if (id) {
        this.getElementModel(id.sourceID).dragged = true
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
        this.hDragGuides.push(
          new DragGuide(
            pageCoordToCanvas(
              el.rect()?.left || 0,
              this.canvasRect.left,
              this.canvasRect.right
            ),
            DragGuideSource.Element,
            Orientation.Horizontal,
            el.id
          )
        )
        this.hDragGuides.push(
          new DragGuide(
            pageCoordToCanvas(
              el.rect()?.right || 0,
              this.canvasRect.left,
              this.canvasRect.right
            ),
            DragGuideSource.Element,
            Orientation.Horizontal,
            el.id
          )
        )

        this.vDragGuides.push(
          new DragGuide(
            pageCoordToCanvas(
              el.rect()?.top || 0,
              this.canvasRect.top,
              this.canvasRect.bottom
            ),
            DragGuideSource.Element,
            Orientation.Vertical,
            el.id
          )
        )
        this.vDragGuides.push(
          new DragGuide(
            pageCoordToCanvas(
              el.rect()?.bottom || 0,
              this.canvasRect.top,
              this.canvasRect.bottom
            ),
            DragGuideSource.Element,
            Orientation.Vertical,
            el.id
          )
        )
      }
    }
  }
})

function defaultElements(): Map<number, ElementModel> {
  const map = new Map<number, ElementModel>()
  map.set(0, {
    id: 0,
    UID: 0,
    type: "text",
    fancyquotes: true,
    bold: false,
    italic: false,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: new Size(0.25, "rem"),
    width: new Size(0, "auto"),
    height: new Size(0, "auto"),
    position: new Vec2(0.05, 0.05),
    rect: () => null,
    font: new FontOption()
  })
  return map
}

export type TemplateT = { map: Map<number, ElementModel>; nextID: number }

function loadTemplateFromArray(
  validTemplate: ElementModel[],
  templateID: number
): TemplateT {
  const map = new Map<number, ElementModel>()

  const tid = Date.now()

  for (const el of validTemplate) {
    el.UID = tid + el.id
    const clone = structuredClone(el)
    clone.padding = Size.from_array(clone.padding as ArraySize)
    clone.font.size = Size.from_array(clone.font.size as ArraySize)
    clone.width = Size.from_array(clone.width as ArraySize)
    clone.height = Size.from_array(clone.height as ArraySize)
    map.set(el.id, clone)
    console.log(structuredClone(el))
  }
  return { map: map, nextID: validTemplate.length }
}

function defaultTemplate(templateID: number): TemplateT {
  const map = new Map<number, ElementModel>()
  map.set(0, {
    id: 0,
    UID: templateID,
    type: "text",
    fancyquotes: true,
    bold: false,
    italic: false,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: new Size(0.25, "rem"),
    width: new Size(0, "auto"),
    height: new Size(0, "auto"),
    position: new Vec2(0, 0),
    rect: () => null,
    font: new FontOption()
  })
  map.set(1, {
    id: 1,
    UID: templateID,
    type: "text",
    fancyquotes: false,
    bold: false,
    italic: false,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: new Size(0.25, "rem"),
    width: new Size(0, "auto"),
    height: new Size(0, "auto"),
    position: new Vec2(0, 0.0666),
    rect: () => null,
    font: new FontOption()
  })

  map.get(1)!.font.size = new Size(25, "pt")
  map.get(1)!.font.is_auto = false
  map.get(1)!.font.color = "#656565"

  map.set(2, {
    id: 2,
    UID: templateID,
    type: "image",
    fancyquotes: true,
    bold: false,
    italic: false,
    value: images[0],
    dragged: false,
    padding: new Size(0.25, "rem"),
    width: new Size(4.5, "rem"),
    height: new Size(0, "auto"),
    position: new Vec2(0.93, 0),
    rect: () => null,
    font: new FontOption()
  })

  return { map: map, nextID: 3 }
}

const template1 = [
  {
    id: 0,
    UID: 1,
    type: "text",
    fancyquotes: true,
    bold: false,
    italic: false,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: {_v: 0.25, type: "rem"} as Size,
    width: { _v: 0, type: "auto" } as Size,
    height: { _v: 0, type: "auto" } as Size,
    position: { x: 0, y: 0 } as Vec2,
    font: {
      family: "Times",
      size: { _v: 32, type: "pt" } as Size,
      is_auto: true,
      color: "#000000"
    } as FontOption
  },
  {
    id: 1,
    UID: 1,
    type: "text",
    fancyquotes: false,
    bold: false,
    italic: false,
    value: "Wybierz aby edytować...",
    dragged: false,
    padding: { _v: 0.25, type: "rem" } as Size,
    width: { _v: 0, type: "auto" } as Size,
    height: { _v: 0, type: "auto" } as Size,
    position: { x: 0, y: 0.0666 } as Vec2,
    font: {
      family: "Times",
      size: { _v: 25, type: "pt" } as Size,
      is_auto: false,
      color: "#656565"
    } as FontOption
  },
  {
    id: 2,
    UID: 1,
    type: "image",
    fancyquotes: true,
    bold: false,
    italic: false,
    value: images[0],
    dragged: false,
    padding: { _v: 0.25, type: "rem" } as Size,
    width: { _v: 6.999999999999995, type: "%" } as Size,
    height: { _v: 11.57029668926601, type: "%" } as Size,
    position: { x: 0.93, y: 0 } as Vec2,
    font: {
      family: "Times",
      size: { _v: 32, type: "pt" } as Size,
      is_auto: true,
      color: "#000000"
    } as FontOption
  }
] as ElementModel[]
const templatate_definitions = [template1] as const

function buildTemplatesFromArr(
  ts: typeof templatate_definitions
): TemplateFN[] {
  
  let ready = [] as TemplateFN[]
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i]
    ready.push((TID: number) => {
      return loadTemplateFromArray(t, TID)
    })
  }
  return ready
}

type TemplateFN = (TID: number) => TemplateT

export const templates: TemplateFN[] = [
  ...buildTemplatesFromArr(templatate_definitions),
  // defaultTemplate
]
