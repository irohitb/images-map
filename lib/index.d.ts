export declare type SERVICENAME = 'unsplash' | 'pexels' | 'pixabay' | 'shutterstock';
export declare type IMAGETYPE = 'photo' | 'illustration' | 'vector';
export declare type ORDER = 'latest' | 'relavent';
export declare type ORIENTATION = 'landscape' | 'portrait';
export interface QUERY_PARAMS {
    query: string;
    min_height?: string;
    max_height?: string;
    min_width?: string;
    max_width?: string;
    color?: string;
    image_type?: IMAGETYPE;
    order?: ORDER;
    orientation?: ORIENTATION;
    page?: number;
    per_page?: number;
}
export interface UNSPLASH {
    query: string;
    color?: string;
    orientation?: ORIENTATION;
    order?: ORDER;
    page?: number;
    per_page?: number;
}
export interface PEXELS {
    query: string;
    page?: number;
    per_page?: number;
}
export interface PIXABAY {
    query: string;
    min_width?: string;
    min_height?: string;
    color?: string;
    image_type?: IMAGETYPE;
    order?: ORDER;
    page?: number;
    per_page?: number;
}
export interface SHUTTERSTOCK_INIT {
    consumer_id: string;
    consumer_secret: string;
}
export interface SHUTTERSTOCK {
    query: string;
    min_height?: string;
    max_height?: string;
    min_width?: string;
    max_width?: string;
    color?: string;
    image_type?: IMAGETYPE;
    order?: ORDER;
    orientation?: ORIENTATION;
    page?: number;
    per_page?: number;
}
export interface IMAGE_DATA {
    width?: number;
    height?: number;
    color?: string;
    url: string;
    name: string;
    id: string;
    siza_small_url: string;
    imageSize?: string;
}
export interface IMAGE_RESPONSE {
    name: SERVICENAME;
    images?: Array<IMAGE_DATA>;
    error?: any;
}
export interface ADD_BLOB {
    image_blob: Blob;
    preserveAttributes: boolean;
}
export interface IMAGE_RESPONSE_WITH_BLOB extends IMAGE_DATA {
    image_blob: Blob;
}
export interface SERVICE {
    unsplash?: string;
    pexels?: string;
    pixabay?: string;
    shutterstock?: SHUTTERSTOCK_INIT;
}
export declare const addBlobToImages: (selectedImages: Array<IMAGE_DATA>) => Promise<Array<IMAGE_RESPONSE_WITH_BLOB>>;
export declare const addBlobToImage: (selectedImage: IMAGE_DATA) => Promise<IMAGE_RESPONSE_WITH_BLOB>;
declare class ImageServices {
    services: SERVICE;
    constructor(services: SERVICE);
    getDataFromUnsplash(clientId: string, params: UNSPLASH): Promise<IMAGE_RESPONSE>;
    getDataFromPexels(clientId: string, params: PEXELS): Promise<IMAGE_RESPONSE>;
    getDataFromPixabay(clientId: string, params: PIXABAY): Promise<IMAGE_RESPONSE>;
    getDataFromShutterStock(clientId: SHUTTERSTOCK_INIT, params: SHUTTERSTOCK): Promise<IMAGE_RESPONSE>;
    getSpecificServiceData(inputParams: QUERY_PARAMS, service: SERVICENAME): Promise<IMAGE_RESPONSE>;
    getAllImages(inputParams: QUERY_PARAMS): Promise<Array<IMAGE_RESPONSE>>;
}
export default ImageServices;
//# sourceMappingURL=index.d.ts.map