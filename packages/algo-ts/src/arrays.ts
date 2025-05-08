type _ArrayExcluded = 'copyWithin'
// | 'every'
// | 'fill'
// | 'filter'
// | 'find'
// | 'findIndex'
// | 'findLast'
// | 'findLastIndex'
// | 'flat'
// | 'flatMap'
// | 'forEach'
// | 'includes'
// | 'indexOf'
// | 'map'
// | 'reduce'
// | 'reverse'
// | 'shift'
// | 'some'
// | 'sort'
// | 'splice'
// | 'toLocaleString'
// | 'toReversed'
// | 'toSorted'
// | 'toSpliced'
// | 'unShift'

export type FixedArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : Omit<_FixedArrayOf<T, N, []>, _FixedArrayExcluded>
  : never

type _FixedArrayExcluded = 'push' | 'pop'

type _FixedArrayOf<T, N extends number, R extends readonly unknown[]> = R['length'] extends N ? R : _FixedArrayOf<T, N, [T, ...R]>
