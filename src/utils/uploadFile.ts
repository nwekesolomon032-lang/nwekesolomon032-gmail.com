export interface UploadedFileResult {
  ok: boolean;
  url: string;
  filename: string;
  name: string;
  size: number;
  mimeType: string;
}

export function uploadBinaryFile(
  endpoint: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedFileResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      try {
        const parsed = JSON.parse(xhr.responseText || '{}') as Partial<UploadedFileResult> & {
          message?: string;
          originalName?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && parsed.ok && parsed.url) {
          resolve({
            ok: true,
            url: parsed.url,
            filename: parsed.filename || '',
            name: parsed.name || parsed.originalName || file.name,
            size: parsed.size || file.size,
            mimeType: parsed.mimeType || file.type,
          });
        } else {
          reject(new Error(parsed.message || `Upload failed with status ${xhr.status}.`));
        }
      } catch {
        reject(new Error('Unexpected response from upload server.'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error while uploading file.'));
    };

    xhr.send(file);
  });
}
