import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const from = resolve('slides/dist')
const to = resolve('dist/slides/dist')

if (!existsSync(from)) {
  console.error('No existe slides/dist: ejecuta primero npm --prefix slides run build')
  process.exit(1)
}

mkdirSync(resolve('dist/slides'), { recursive: true })
cpSync(from, to, { recursive: true })
console.log(`Diapositivas copiadas a ${to}`)
