import { NoteInfo } from '../../../shared/models'
import { ComponentProps } from 'react'
import { cn, formatDateFromMs } from '@renderer/utils'

export type notePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: notePreviewProps) => {
  return (
    <div
      className={cn(
        'cursor-pointer px-2.5 py-4 rounded-md transition-colors duration-75',
        { 'bg-zinc-400/75': isActive, 'hover:bg-zinc-500/75': !isActive },
        className
      )}
      {...props}
    >
      <h3 className="mb-1 font-bold truncate">{title}</h3>
      <span className="inline-block w-full mb-2 text-xs font-light text-left">
        {formatDateFromMs(lastEditTime)}
      </span>
    </div>
  )
}
