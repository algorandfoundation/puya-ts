#!/usr/bin/env node

import { Constants } from '../constants'
import { logger, LogLevel } from '../logger'
import { ConsoleLogSink } from '../logger/sinks/console-log-sink'
import { downloadPuyaBinary } from '../puya/puya-binary'
import { parseSemVer } from '../puya/semver'

logger.configure([new ConsoleLogSink(LogLevel.Debug)])
const version = parseSemVer(Constants.targetedPuyaVersion)

void downloadPuyaBinary(version)
