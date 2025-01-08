class MarkMaker implements Disposable {
  constructor(private readonly name: string) {
    performance.mark(`${name}_start`)
  }

  [Symbol.dispose]() {
    performance.mark(`${this.name}_stop`)
  }
}

const marks = {
  typeScript: 'TypeScriptCompile',
  awstBuild: 'AwstBuild',
  puyaCompile: 'PuyaCompile',
}

function getMeasure(name: string) {
  return performance.measure(name, `${name}_start`, `${name}_stop`)
}

export const perfmon = {
  markTypeScript() {
    return new MarkMaker(marks.typeScript)
  },
  markAwstBuild() {
    return new MarkMaker(marks.awstBuild)
  },
  markPuyaCompile() {
    return new MarkMaker(marks.puyaCompile)
  },

  gatherMeasurements() {
    const ts = getMeasure(marks.typeScript)
    const awst = getMeasure(marks.awstBuild)
    const puya = getMeasure(marks.puyaCompile)
    console.log([ts, awst, puya])
  },
}
