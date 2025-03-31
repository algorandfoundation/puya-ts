#!/usr/bin/env node

/* This script updates the version of algo-ts in the package.json file
 * of the algo-ts package . It is triggered in the release pipeline of
 * the algo-ts package. It takes the version as an argument and updates
 * the package.json file accordingly. This is useful for keeping the version
 * of algo-ts in sync with the version of the puya-ts package.
 */

import fs from 'fs'
import algotsPackage from '../algo-ts/package.json'

const args = process.argv.slice(2)
algotsPackage.version = args[0]
fs.writeFileSync('artifacts/algo-ts/package.json', JSON.stringify(algotsPackage, null, 2))
