export function invertMap<A, B>(map: Map<A, B>): Map<B, A> {
    return new Map(Array.from(map, a => a.reverse() as [B, A]))
}