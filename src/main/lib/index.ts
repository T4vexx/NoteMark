import { appDir, fileEnconding } from '../../shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'
import path from 'path'
import { isEmpty } from 'lodash'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}\\${appDir}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const notesFilesNames = await readdir(rootDir, {
    encoding: fileEnconding,
    withFileTypes: false
  })

  const notes = notesFilesNames.filter((fn) => fn.endsWith('.md'))
  if (isEmpty(notes)) {
    const content = await readFile(welcomeNoteFile, { encoding: fileEnconding })

    await writeFile(`${rootDir}/Welcome 👋.md`, content, { encoding: fileEnconding })

    notes.push('Welcome 👋.md')
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (fileName) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${fileName}.md`, { encoding: fileEnconding })
}

export const writeNote: WriteNote = async (fileName, content) => {
  const rootDir = getRootDir()

  return writeFile(`${rootDir}/${fileName}.md`, content, { encoding: fileEnconding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Nova anotação',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Criar',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) return false

  const { name: filename, dir: parentDir } = path.parse(filePath)
  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Falha na criação',
      message: `Todas as anotações devem ser salvas na pasta ${rootDir}
Evite usar outros diretórios`
    })

    return false
  }

  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (fileName) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Deletar nota',
    message: `Você tem certeza que quer deletar ${fileName}?`,
    buttons: ['Deletar', 'Cancelar'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    return false
  }

  await remove(`${rootDir}/${fileName}.md`)
  return true
}
