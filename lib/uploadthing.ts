import {useState} from "react"
import axios from "axios"

interface UseUploadFileProps {
    onUploadComplete?: (file: UploadedFile) => void
    onUploadError?: (error: unknown) => void
    headers?: Record<string, string>
    onUploadBegin?: (fileName: string) => void
    onUploadProgress?: (progress: {progress: number}) => void
    skipPolling?: boolean
}

interface UploadedFile {
    url: string
    name: string // Original filename
    size: number // File size in bytes
    type: string // MIME type
}

export function useUploadFile({onUploadComplete, onUploadError, onUploadProgress}: UseUploadFileProps = {}) {
    const [uploadedFile, setUploadedFile] = useState<UploadedFile>()
    const [uploadingFile, setUploadingFile] = useState<File>()
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    async function uploadFile(file: File) {
        setIsUploading(true)
        setUploadingFile(file)

        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await axios
                .post("/api/upload/image", formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                    onUploadProgress: (progressEvent) => {
                        // @ts-ignore
                        const progress = (progressEvent.loaded / progressEvent.total) * 100
                        setProgress(progress)
                        onUploadProgress?.({progress})
                    },
                })
                .then((res) => res.data)

            const uploadedFile = {
                url: res.url,
                name: file.name,
                size: file.size,
                type: file.type,
            }

            setUploadedFile(uploadedFile)
            onUploadComplete?.(uploadedFile)

            return uploadedFile
        } catch (error) {
            onUploadError?.(error)
            throw error
        } finally {
            setProgress(0)
            setIsUploading(false)
            setUploadingFile(undefined)
        }
    }

    return {
        isUploading,
        progress,
        uploadFile,
        uploadedFile,
        uploadingFile,
    }
}
