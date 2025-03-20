#!/usr/bin/env node

import { Constants } from '../constants'
import { downloadPuyaBinary, getPuyaStorageDir } from '../puya/puya-binary'
import { parseSemVer } from '../puya/semver'

const version = parseSemVer(Constants.targetedPuyaVersion)
const puyaStorageDir = getPuyaStorageDir()

void downloadPuyaBinary(puyaStorageDir, version)
