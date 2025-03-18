#!/usr/bin/env node

import { Constants } from '../constants'
import { downloadPuyaBinary } from '../puya/puya-binary'
import { parseSemVer } from '../puya/semver'

const version = parseSemVer(Constants.targetedPuyaVersion)
void downloadPuyaBinary(version)
