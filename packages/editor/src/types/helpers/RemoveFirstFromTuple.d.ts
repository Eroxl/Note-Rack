type RemoveFirstFromTuple<T extends any[]> = (((...b: T) => void) extends (a, ...b: infer I) => void ? I : [])

export default RemoveFirstFromTuple;
