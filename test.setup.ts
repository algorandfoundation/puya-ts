// to setup mock env variables, copy contents of tests/.env.template to tests/.env and update them as needed
import * as dotenv from 'dotenv'
import path from 'path'

// Set max listeners to infinite for tests since vitest makes use of listeners per running test to detect errors
process.setMaxListeners(0)

dotenv.config({ path: path.join(__dirname, 'tests', '.env') })
