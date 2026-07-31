/* ==========================================================
   REMADEF PLATFORM
   Files Service
   File: src/services/files.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    FileUpload,
    FileRecord,
    Folder,
    FileShare,
    FilePermission,
    FileFilter,
    UploadOptions
} from "../types/files";

class FilesService {

    /* ======================================================
       UPLOAD
    ====================================================== */

    upload(
        file: File,
        options?: UploadOptions
    ): Promise<ApiResponse<FileUpload>> {

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        if (options) {

            Object.entries(options).forEach(

                ([key, value]) => {

                    if (
                        value !== undefined &&
                        value !== null
                    ) {

                        formData.append(
                            key,
                            String(value)
                        );

                    }

                }

            );

        }

        return Client.upload(

            ENDPOINTS.FILES.UPLOAD,

            formData

        );

    }

    /* ======================================================
       FILES
    ====================================================== */

    getFiles(
        page = 1,
        limit = 20,
        filter?: FileFilter
    ): Promise<ListResponse<FileRecord>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(

                ([key, value]) => {

                    if (
                        value !== undefined &&
                        value !== null
                    ) {

                        params.append(
                            key,
                            String(value)
                        );

                    }

                }

            );

        }

        return Client.get(

            `${ENDPOINTS.FILES.ROOT}?${params.toString()}`

        );

    }

    getFile(
        fileId: string
    ): Promise<ApiResponse<FileRecord>> {

        return Client.get(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}`

        );

    }

    updateFile(
        fileId: string,
        data: Partial<FileRecord>
    ): Promise<ApiResponse<FileRecord>> {

        return Client.patch(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}`,

            data

        );

    }

    deleteFile(
        fileId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}`

        );

    }

    /* ======================================================
       FOLDERS
    ====================================================== */

    getFolders(): Promise<ApiResponse<Folder[]>> {

        return Client.get(

            ENDPOINTS.FILES.FOLDERS

        );

    }

    createFolder(
        name: string,
        parentId?: string
    ): Promise<ApiResponse<Folder>> {

        return Client.post(

            ENDPOINTS.FILES.FOLDERS,

            {
                name,
                parentId
            }

        );

    }

    /* ======================================================
       SHARING
    ====================================================== */

    shareFile(
        fileId: string,
        data: FileShare
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}/share`,

            data

        );

    }

    getPermissions(
        fileId: string
    ): Promise<ApiResponse<FilePermission[]>> {

        return Client.get(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}/permissions`

        );

    }

    updatePermissions(
        fileId: string,
        permissions: FilePermission[]
    ): Promise<ApiResponse> {

        return Client.put(

            `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}/permissions`,

            permissions

        );

    }

    /* ======================================================
       DOWNLOAD
    ====================================================== */

    getDownloadUrl(
        fileId: string
    ): string {

        return `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}/download`;

    }

    getPreviewUrl(
        fileId: string
    ): string {

        return `${ENDPOINTS.FILES.ROOT}/${encodeURIComponent(fileId)}/preview`;

    }

}

export default new FilesService();
