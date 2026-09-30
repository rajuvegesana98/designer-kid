import { FileUp } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { FileAsset } from '../content/types'
import { store } from '../data'
import { useToast } from '../state/ui'

export const DOC_ACCEPT =
  '.pdf,.ppt,.pptx,.key,.odp,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'

const MAX_DOC_BYTES = 50 * 1024 * 1024

/** Uploads PDFs / slide decks to the media library and returns them as a FileAsset. */
export function useDocUpload() {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const upload = async (file?: File | null): Promise<FileAsset | null> => {
    if (!file) return null
    if (file.size > MAX_DOC_BYTES) {
      toast('Files must be under 50 MB.', 'error')
      return null
    }
    setBusy(true)
    try {
      const item = await store.uploadMedia(file, 'documents')
      toast(`${file.name} uploaded`)
      return { url: item.url, name: file.name, mimeType: file.type || item.mimeType, size: file.size }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error')
      return null
    } finally {
      setBusy(false)
    }
  }
  return { upload, busy }
}

export function DocUploadButton({ onUploaded, children, className = 'btn btn-sm' }: { onUploaded: (f: FileAsset) => void; children?: ReactNode; className?: string }) {
  const { upload, busy } = useDocUpload()
  return (
    <label className={className} style={{ cursor: busy ? 'progress' : 'pointer' }}>
      <FileUp size={16} aria-hidden /> {busy ? 'Uploading…' : (children ?? 'Upload PDF or PPT')}
      <input
        type="file"
        accept={DOC_ACCEPT}
        className="sr-only"
        disabled={busy}
        onChange={async (e) => {
          const f = await upload(e.target.files?.[0])
          e.target.value = ''
          if (f) onUploaded(f)
        }}
      />
    </label>
  )
}
