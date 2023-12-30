type RemoveFirstFromTuple<T extends any[]> = (((...b: T) => void) extends (a: infer _, ...b: infer I) => void ? I : [])

export default RemoveFirstFromTuple;
