export function getPuyaEnv() {
  return {
    binaryPath: process.env.PUYA_BINARY_PATH,
    scriptPath: process.env.PUYA_SCRIPT_PATH,
  }
}
