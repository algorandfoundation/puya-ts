#!/usr/bin/env node

import { logger, LogLevel } from '../logger'
import { ConsoleLogSink } from '../logger/sinks/console-log-sink'
import { resolvePuyaPath } from '../puya/resolve-puya-path'

logger.configure([new ConsoleLogSink(LogLevel.Debug)])

void resolvePuyaPath({})
