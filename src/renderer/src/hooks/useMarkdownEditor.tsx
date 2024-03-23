import { MDXEditorMethods } from '@mdxeditor/editor'
import { saveNoteAtom, selectedNoteAtom } from '@renderer/store'
import { NoteContent } from '../../../shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import { throttle } from 'lodash'
import { autoSavingTime } from '../../../shared/constants'

export const useMarkdownEditor = () => {
  const selectedNotes = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)

  const editorRef = useRef<MDXEditorMethods>(null)

  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNotes) return

      await saveNote(content)
    },
    autoSavingTime,
    {
      leading: false,
      trailing: true
    }
  )

  const handlerBlur = async () => {
    if (!selectedNotes) return

    handleAutoSaving.cancel()

    const content = editorRef.current?.getMarkdown()
    if (content != null) {
      await saveNote(content)
    }
  }

  return {
    editorRef,
    selectedNotes,
    handleAutoSaving,
    handlerBlur
  }
}
