"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBlobToImage = exports.addBlobToImages = void 0;
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const upload_base_url = 'https://api.unsplash.com';
const pexels_base_url = 'https://api.pexels.com/v1';
const pixabay_base_url = 'https://pixabay.com/api';
const shutterstock_base_url = 'https://api.shutterstock.com/v2';
const unsplash_allowed_props = {
    query: true,
    color: true,
    orientation: true,
    order: true,
    page: true,
    per_page: true
};
const Pexels = {
    query: true,
    page: true,
    per_page: true
};
const pixabay_allowed_props = {
    query: true,
    min_width: true,
    min_height: true,
    color: true,
    image_type: true,
    order: true,
    page: true,
    per_page: true
};
const canMakeApiRequest = (supported, actual) => {
    for (let param in actual) {
        if (!lodash_1.default.has(supported, param)) {
            return false;
        }
    }
    return true;
};
const addBlobToImages = async (selectedImages) => {
    try {
        const imagePromises = selectedImages.map(async (img) => {
            const image_blob = await fetch(img.url).then((r) => r.blob());
            return Object.assign(Object.assign({}, img), { image_blob });
        });
        const imageWithBlob = await Promise.all(imagePromises);
        return imageWithBlob;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.addBlobToImages = addBlobToImages;
const addBlobToImage = async (selectedImage) => {
    try {
        const image_blob = await fetch(selectedImage.url).then((r) => r.blob());
        return Object.assign(Object.assign({}, selectedImage), { image_blob });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.addBlobToImage = addBlobToImage;
class ImageServices {
    constructor(services) {
        // creating key-value pair, key -> name of service, value api key (easy to access)
        this.services = Object.assign({}, services);
    }
    async getDataFromUnsplash(clientId, params) {
        try {
            let paramsWithClientId = Object.assign(Object.assign({}, params), { client_id: clientId });
            const { data } = await axios_1.default.get(`${upload_base_url}/search/photos`, {
                params: paramsWithClientId
            });
            const { results } = data;
            const images = results.map((image) => {
                return {
                    id: image.id,
                    width: image.width,
                    height: image.height,
                    color: image.color,
                    name: image.alt_description || image.id,
                    url: image.urls.raw,
                    siza_small_url: image.urls.small
                };
            });
            return { name: 'unsplash', images };
        }
        catch (error) {
            console.error(error);
            return { name: 'unsplash', error };
        }
    }
    async getDataFromPexels(clientId, params) {
        try {
            const { data } = await axios_1.default.get(`${pexels_base_url}/search`, {
                params,
                headers: {
                    Authorization: clientId
                }
            });
            const { photos } = data;
            const images = photos.map((image) => {
                return {
                    id: image.id,
                    width: image.width,
                    height: image.height,
                    name: image.id,
                    url: image.src.original,
                    siza_small_url: image.src.medium
                };
            });
            return { name: 'pexels', images };
        }
        catch (error) {
            console.error(error);
            return { name: 'pexels', error };
        }
    }
    async getDataFromPixabay(clientId, params) {
        try {
            const { query } = params, rest = __rest(params, ["query"]);
            const newParams = Object.assign(Object.assign({}, rest), { key: clientId, q: query });
            const { data } = await axios_1.default.get(`${pixabay_base_url}`, {
                params: newParams
            });
            const { hits } = data;
            const images = hits.map((image) => {
                return {
                    id: image.id,
                    width: image.previewWidth,
                    height: image.previewHeight,
                    name: image.id,
                    url: image.largeImageURL,
                    siza_small_url: image.previewURL,
                    imageSize: image.imageSize
                };
            });
            return { name: 'pixabay', images };
        }
        catch (error) {
            return { name: 'pixabay', error };
        }
    }
    async getDataFromShutterStock(clientId, params) {
        try {
            const { consumer_id, consumer_secret } = clientId;
            let copyParams = Object.assign({}, params);
            if (params['orientation'] === 'landscape') {
                copyParams = Object.assign(Object.assign({}, params), { orientation: 'horizontal' });
            }
            else if (params['orientation'] === 'portrait') {
                copyParams = Object.assign(Object.assign({}, params), { orientation: 'vertical' });
            }
            const tok = `${consumer_id}:${consumer_secret}`;
            const hash = btoa(tok);
            const Basic = 'Basic ' + hash;
            const { data } = await axios_1.default.get(`${shutterstock_base_url}/images/search`, {
                params: copyParams,
                headers: { Authorization: Basic }
            });
            const result = data.data; // unsplash gives all the images in data and axios gives data in data so data.data
            const images = result.map((image) => {
                return {
                    id: image.id,
                    width: image.assets.preview.width,
                    height: image.assets.preview.height,
                    name: image.assets.description || image.id,
                    url: image.assets.url,
                    siza_small_url: image.assets.huge_thumb.url
                };
            });
            return { name: 'shutterstock', images };
        }
        catch (error) {
            return { name: 'shutterstock', error };
        }
    }
    async getSpecificServiceData(inputParams, service) {
        const clientId = this.services[service];
        if (!clientId)
            throw new Error(`Client ID does not exist for service ${service}`);
        if (service === 'unsplash' &&
            canMakeApiRequest(unsplash_allowed_props, inputParams) &&
            typeof clientId === 'string') {
            return await this.getDataFromUnsplash(clientId, inputParams);
        }
        else if (service === 'pexels' &&
            canMakeApiRequest(Pexels, inputParams) &&
            typeof clientId === 'string') {
            return await this.getDataFromPexels(clientId, inputParams);
        }
        else if (service === 'pixabay' &&
            canMakeApiRequest(pixabay_allowed_props, inputParams) &&
            typeof clientId === 'string') {
            return await this.getDataFromPixabay(clientId, inputParams);
        }
        else if (service === 'shutterstock' && typeof clientId === 'object') {
            return await this.getDataFromShutterStock(clientId, inputParams);
        }
        else {
            throw new Error('Service Passed does not exist or problem with input params');
        }
    }
    async getAllImages(inputParams) {
        const apiCallsToMake = [];
        for (const [service, serviceKey] of Object.entries(this.services)) {
            if (service === 'unsplash' && canMakeApiRequest(unsplash_allowed_props, inputParams)) {
                apiCallsToMake.push(this.getDataFromUnsplash(serviceKey, inputParams));
            }
            else if (service === 'pexels' && canMakeApiRequest(Pexels, inputParams)) {
                apiCallsToMake.push(this.getDataFromPexels(serviceKey, inputParams));
            }
            else if (service === 'pixabay' && canMakeApiRequest(pixabay_allowed_props, inputParams)) {
                apiCallsToMake.push(this.getDataFromPixabay(serviceKey, inputParams));
            }
            else if (service === 'shutterstock') {
                apiCallsToMake.push(this.getDataFromShutterStock(serviceKey, inputParams));
            }
        }
        return Promise.all(apiCallsToMake).then((response) => response);
    }
}
exports.default = ImageServices;
//# sourceMappingURL=index.js.map