/**
 * Storage Service
 * Abstraction for local and AWS S3 storage
 * Toggle between local storage and AWS via config
 */

import { config, isLocalStorage } from '@/lib/config';

export interface StorageFile {
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

// Mock file storage for local development
const fileStore = new Map<string, StorageFile>();

export const storageService = {
  /**
   * Upload file to storage
   */
  upload: async (
    file: File | Blob,
    folder: string,
    fileName?: string
  ): Promise<StorageFile> => {
    if (isLocalStorage()) {
      // Local storage mock
      return uploadToLocal(file, folder, fileName);
    } else {
      // AWS S3 upload
      return uploadToAWS(file, folder, fileName);
    }
  },

  /**
   * Download file from storage
   */
  download: async (fileUrl: string): Promise<Blob> => {
    if (isLocalStorage()) {
      return downloadFromLocal(fileUrl);
    } else {
      return downloadFromAWS(fileUrl);
    }
  },

  /**
   * Delete file from storage
   */
  delete: async (fileUrl: string): Promise<boolean> => {
    if (isLocalStorage()) {
      return deleteFromLocal(fileUrl);
    } else {
      return deleteFromAWS(fileUrl);
    }
  },

  /**
   * List files in folder
   */
  list: async (folder: string): Promise<StorageFile[]> => {
    if (isLocalStorage()) {
      return listLocal(folder);
    } else {
      return listAWS(folder);
    }
  },

  /**
   * Generate certificate PDF and store
   */
  uploadCertificate: async (
    pdfBlob: Blob,
    userId: string,
    certificateNumber: string
  ): Promise<string> => {
    const fileName = `${certificateNumber}.pdf`;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    const stored = await storageService.upload(file, `certificates/${userId}`, fileName);
    return stored.url;
  },
};

/**
 * Local Storage Implementation
 */
async function uploadToLocal(
  file: File | Blob,
  folder: string,
  fileName?: string
): Promise<StorageFile> {
  const name = fileName || (file instanceof File ? file.name : `file-${Date.now()}`);
  const key = `${folder}/${name}`;

  const storageFile: StorageFile = {
    name,
    type: file.type,
    size: file.size,
    url: `local://${key}`,
    uploadedAt: new Date(),
    metadata: {
      folder,
      localKey: key,
    },
  };

  fileStore.set(key, storageFile);

  // Store file as base64 in localStorage
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      const base64 = reader.result as string;
      try {
        // Store metadata in session storage for demo
        const files = JSON.parse(sessionStorage.getItem('_uploaded_files') || '{}');
        files[key] = {
          ...storageFile,
          data: base64.substring(0, 100) + '...', // truncate for display
        };
        sessionStorage.setItem('_uploaded_files', JSON.stringify(files));
      } catch (e) {
        console.warn('Could not store file in sessionStorage', e);
      }
      resolve(storageFile);
    };
    reader.readAsDataURL(file);
  });
}

async function downloadFromLocal(fileUrl: string): Promise<Blob> {
  if (fileUrl.startsWith('local://')) {
    const key = fileUrl.replace('local://', '');
    const stored = fileStore.get(key);

    if (stored) {
      return new Blob([], { type: stored.type });
    }
  }

  throw new Error('File not found in local storage');
}

function deleteFromLocal(fileUrl: string): boolean {
  if (fileUrl.startsWith('local://')) {
    const key = fileUrl.replace('local://', '');
    return fileStore.delete(key);
  }
  return false;
}

function listLocal(folder: string): Promise<StorageFile[]> {
  const files = Array.from(fileStore.values()).filter((f) => f.metadata?.folder === folder);
  return Promise.resolve(files);
}

/**
 * AWS S3 Implementation (Stub for now)
 */
async function uploadToAWS(
  file: File | Blob,
  folder: string,
  fileName?: string
): Promise<StorageFile> {
  const name = fileName || (file instanceof File ? file.name : `file-${Date.now()}`);

  // Stub implementation - would use AWS SDK
  const storageFile: StorageFile = {
    name,
    type: file.type,
    size: file.size,
    url: `s3://${config.storage.aws.bucketName}/${folder}/${name}`,
    uploadedAt: new Date(),
    metadata: {
      folder,
      bucket: config.storage.aws.bucketName,
    },
  };

  return storageFile;
}

async function downloadFromAWS(fileUrl: string): Promise<Blob> {
  // Stub implementation
  throw new Error('AWS S3 download not yet implemented');
}

function deleteFromAWS(fileUrl: string): boolean {
  // Stub implementation
  console.log('AWS S3 delete would be called for:', fileUrl);
  return true;
}

async function listAWS(folder: string): Promise<StorageFile[]> {
  // Stub implementation
  console.log('AWS S3 list would be called for:', folder);
  return [];
}
