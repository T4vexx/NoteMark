import {
  Content,
  RootLayout,
  Sidebar,
  ActionButtonsRow,
  NotePreviewList,
  FloatingNoteTitle
} from '@/components'
import { MarkdownEditor } from './components/MarkdownEditor'
import { useRef } from 'react'

function App(): JSX.Element {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <RootLayout>
      <Sidebar className="p-2 bg-zinc-700/50">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>
      <Content ref={contentContainerRef} className="p-2 border-l bg-zinc-900/50 border-l-white/20">
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
    </RootLayout>
  )
}

export default App
