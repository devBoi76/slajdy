export function pageCoordToCanvas(page: number, min: number, max: number): number {
    let adjx = Math.min(Math.max(0, page - min), max)
    return adjx / Math.abs(max - min)
}
