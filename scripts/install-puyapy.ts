import { spawnSync } from 'node:child_process'
import { Constants } from '../src/constants'

function installPuyapy(version: string) {
  spawnSync('pipx', ['install', `puyapy==${version}`, '--python', '3.12'], {
    stdio: 'inherit',
  })
}

installPuyapy(Constants.targetedPuyaVersion)
