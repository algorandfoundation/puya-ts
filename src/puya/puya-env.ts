export function getPuyaEnv() {
  return {
    command: process.env.PUYA_COMMAND,
    scriptPath: process.env.PUYA_SCRIPT_PATH,
  }
}
