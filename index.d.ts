declare module "@zip.js/zip.js" {

    export function configure(configuration: ConfigurationOptions): void;

    global {
        interface FileSystemEntry { }
    }

    export interface ConfigurationOptions {
        useWebWorkers?: boolean;
        maxWorkers?: number;
        workerScripts?: {
            deflate?: string[];
            inflate?: string[];
        };
        chunkSize?: number;
        Deflate?: Codec;
        Inflate?: Codec;
    }

    export function initShimAsyncCodec(constructor: object, constructorOptions?: any): { Deflate: Codec, Inflate: Codec };

    export interface Codec {
        append(data: Uint8Array): Promise<Uint8Array>;
        flush(): Promise<Uint8Array>;
    }

    export function getMimeType(fileExtension: string): string;

    export class Stream {
        public size: number;
        public init(): Promise<void>;
    }

    export class Reader extends Stream {
        public readUint8Array(index: number, length: number): Promise<Uint8Array>;
    }

    export class TextReader extends Reader {
        constructor(text: string);
    }

    export class BlobReader extends Reader {
        constructor(blob: Blob);
    }

    export class Data64URIReader extends Reader {
        constructor(dataURI: string);
    }

    export class Uint8ArrayReader extends Reader {
        constructor(array: Uint8Array);
    }

    export class HttpReader extends Reader {
        constructor(url: string);
    }

    export class HttpRangeReader extends Reader {
        constructor(url: string);
    }

    export class Writer extends Stream {
        public writeUint8Array(array: Uint8Array): Promise<void>;
    }

    export class TextWriter extends Writer {
        constructor(encoding?: string);
        public getData(): string;
    }

    export class BlobWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): Blob;
    }

    export class Data64URIWriter extends Writer {
        constructor(mimeString?: string);
        public getData(): string;
    }

    export class Uint8ArrayWriter extends Writer {
        constructor();
        public getData(): Uint8Array;
    }

    export class ZipReader {
        constructor(reader: Reader, options?: ZipReaderOptions | GetEntriesOptions);
        getEntries(options?: GetEntriesOptions): Promise<Entry[]>;
        close(): Promise<any>;
    }

    export interface ZipReaderOptions {
        checkSignature?: boolean;
        password?: string;
        useWebWorkers?: boolean;
    }

    export interface GetEntriesOptions {
        filenameEncoding?: string;
        commentEncoding?: string;
    }

    export interface Entry {
        filename: string;
        rawFilename: Uint8Array;
        filenameUTF8: boolean;
        directory: boolean;
        encrypted: boolean;
        compressedSize: number;
        uncompressedSize: number;
        lastModDate: Date;
        rawLastModDate: number;
        comment: string;
        rawComment: Uint8Array;
        commentUTF8: boolean;
        signature: Uint8Array;
        extraField?: Map<number, Uint8Array>;
        rawExtraField: Uint8Array;
        getData?(writer: Writer, options?: GetDataOptions): Promise<any>;
    }

    export interface GetDataOptions {
        onprogress?: (progress: number, total: number) => void;
        checkSignature?: boolean;
        password?: string;
        useWebWorkers?: boolean;
    }

    export class ZipWriter {
        constructor(writer: Writer, options?: ZipWriterOptions);
        public add(name: string, reader: Reader, options?: AddDataOptions): Promise<Entry>;
        public close(comment?: Uint8Array): Promise<any>;
    }

    export interface ZipWriterOptions {
        zip64?: boolean;
        level?: number;
        bufferedWrite?: boolean;
        version?: number;
        password?: string;
        encryptionStrength?: number;
        useWebWorkers?: boolean;
    }

    export interface AddDataOptions {
        onprogress?: (progress: number, total: number) => void;
        directory?: boolean;
        level?: number;
        bufferedWrite?: boolean;
        comment?: string;
        lastModDate?: Date;
        version?: number;
        password?: string;
        zip64?: boolean;
        extraField?: Map<number, Uint8Array>;
        useWebWorkers?: boolean;
    }

    export interface ZipEntry {
        name: string;
        data?: Entry;
        id: number;
        parent?: ZipEntry;
        children: ZipEntry[];
        uncompressedSize: number;
        getFullname(): string;
        getRelativeName(ancestor: ZipDirectoryEntry): string
        isDescendantOf(ancestor: ZipDirectoryEntry): boolean;
    }

    export interface ZipFileEntry extends ZipEntry {
        reader: Reader;
        writer: Writer;
        getText(encoding?: string, options?: GetDataOptions): Promise<string>;
        getBlob(mimeType?: string, options?: GetDataOptions): Promise<Blob>;
        getData64URI(mimeType?: string, options?: GetDataOptions): Promise<string>;
        getData(writer: Writer, options?: GetDataOptions): Promise<any>;
        replaceBlob(blob: Blob): void;
        replaceText(text: String): void;
        replaceData64URI(dataURI: String): void;
    }

    interface ExportOptions {
        relativePath?: boolean;
    }

    export interface ZipDirectoryEntry extends ZipEntry {
        getChildByName(name: string): ZipEntry;
        addDirectory(name: string): ZipDirectoryEntry;
        addText(name: string, text: string): ZipFileEntry;
        addBlob(name: string, blob: Blob): ZipFileEntry;
        addData64URI(name: string, dataURI: string): ZipFileEntry;
        addHttpContent(name: string, url: string, options?: GetHttpContentOptions): ZipFileEntry;
        addFileSystemEntry(fileSystemEntry: FileSystemEntry): Promise<ZipEntry>;
        importBlob(blob: Blob, options?: ZipReaderOptions | GetEntriesOptions): Promise<void>;
        importData64URI(dataURI: string, options?: ZipReaderOptions | GetEntriesOptions): Promise<void>;
        importHttpContent(url: string, options?: ZipReaderOptions | GetEntriesOptions | GetHttpContentOptions): Promise<void>;
        exportBlob(options?: ZipWriterOptions | ExportOptions): Promise<Blob>;
        exportData64URI(options?: ZipWriterOptions | ExportOptions): Promise<string>;
    }

    export interface GetHttpContentOptions {
        useRangeHeader?: boolean;
    }

    export interface FS extends ZipDirectoryEntry {
        root: ZipDirectoryEntry;
        remove(entry: ZipEntry): void;
        move(entry: ZipEntry, destination: ZipDirectoryEntry): void;
        find(fullname: string): ZipEntry;
        getById(id: number): ZipEntry;
    }

    export const fs: { FS: FS, ZipDirectoryEntry: ZipDirectoryEntry, ZipFileEntry: ZipFileEntry };
    export const ERR_HTTP_RANGE: string;
    export const ERR_BAD_FORMAT: string;
    export const ERR_EOCDR_NOT_FOUND: string;
    export const ERR_EOCDR_ZIP64_NOT_FOUND: string;
    export const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: string;
    export const ERR_CENTRAL_DIRECTORY_NOT_FOUND: string;
    export const ERR_LOCAL_FILE_HEADER_NOT_FOUND: string;
    export const ERR_EXTRAFIELD_ZIP64_NOT_FOUND: string;
    export const ERR_ENCRYPTED: string;
    export const ERR_UNSUPPORTED_COMPRESSION: string;
    export const ERR_INVALID_SIGNATURE: string;
    export const ERR_INVALID_PASSWORD: string;
    export const ERR_DUPLICATED_NAME: string;
    export const ERR_INVALID_COMMENT: string;
    export const ERR_INVALID_ENTRY_NAME: string;
    export const ERR_INVALID_ENTRY_COMMENT: string;
    export const ERR_INVALID_VERSION: string;
    export const ERR_INVALID_DATE: string;
    export const ERR_INVALID_EXTRAFIELD_TYPE: string;
    export const ERR_INVALID_EXTRAFIELD_DATA: string;
    export const ERR_INVALID_ENCRYPTION_STRENGTH: string;

}