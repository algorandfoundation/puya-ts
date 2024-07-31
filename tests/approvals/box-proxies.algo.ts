import { Box, Bytes } from '@algorandfoundation/algo-ts'

const boxA = Box<string>({ key: Bytes('A') })
function writeToBox(box: Box<string>, value: string) {
  box.value = value
  boxA.value = value
}
