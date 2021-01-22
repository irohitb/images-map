import _ from 'lodash'
import axios from 'axios'

export type SERVICENAME = 'unsplash' | 'pexels' | 'pixabay' | 'shutterstock'
export type IMAGETYPE = 'photo' | 'illustration' | 'vector'
export type ORDER = 'latest' | 'relavent'
export type ORIENTATION = 'landscape' | 'portrait'

export interface QUERY_PARAMS {
  query: string
  min_height?: string
  max_height?: string
  min_width?: string
  max_width?: string
  color?: string
  image_type?: IMAGETYPE
  order?: ORDER
  orientation?: ORIENTATION
  page?: number
  per_page?: number
}

export interface UNSPLASH {
  query: string
  color?: string
  orientation?: ORIENTATION
  order?: ORDER
  page?: number
  per_page?: number
}

export interface PEXELS {
  query: string
  page?: number
  per_page?: number
}

export interface PIXABAY {
  query: string
  min_width?: string
  min_height?: string
  color?: string
  image_type?: IMAGETYPE
  order?: ORDER
  page?: number
  per_page?: number
}
export interface SHUTTERSTOCK_INIT {
  consumer_id: string
  consumer_secret: string
}

export interface SHUTTERSTOCK {
  query: string
  min_height?: string
  max_height?: string
  min_width?: string
  max_width?: string
  color?: string
  image_type?: IMAGETYPE
  order?: ORDER
  orientation?: ORIENTATION
  page?: number
  per_page?: number
}

export interface IMAGE_DATA {
  width?: number
  height?: number
  color?: string
  url: string
  name: string
  id: string
  siza_small_url: string
  imageSize?: string
}

export interface IMAGE_RESPONSE {
  name: SERVICENAME
  images?: Array<IMAGE_DATA>
  error?: any
}

export interface ADD_BLOB {
  image_blob: Blob
  preserveAttributes: boolean
}

export interface IMAGE_RESPONSE_WITH_BLOB extends IMAGE_DATA {
  image_blob: Blob
}
export interface SERVICE {
  unsplash?: string
  pexels?: string
  pixabay?: string
  shutterstock?: SHUTTERSTOCK_INIT
}

const upload_base_url = 'https://api.unsplash.com'
const pexels_base_url = 'https://api.pexels.com/v1'
const pixabay_base_url = 'https://pixabay.com/api'
const shutterstock_base_url = 'https://api.shutterstock.com/v2'

const unsplash_allowed_props = {
  query: true,
  color: true,
  orientation: true,
  order: true,
  page: true,
  per_page: true
}

const Pexels = {
  query: true,
  page: true,
  per_page: true
}

const pixabay_allowed_props = {
  query: true,
  min_width: true,
  min_height: true,
  color: true,
  image_type: true,
  order: true,
  page: true,
  per_page: true
}

const canMakeApiRequest = (supported: any, actual: QUERY_PARAMS) => {
  for (let param in actual) {
    if (!_.has(supported, param)) {
      return false
    }
  }
  return true
}

export const addBlobToImages = async (
  selectedImages: Array<IMAGE_DATA>
): Promise<Array<IMAGE_RESPONSE_WITH_BLOB>> => {
  try {
    const imagePromises: any[] = selectedImages.map(
      async (img: IMAGE_DATA): Promise<IMAGE_RESPONSE_WITH_BLOB> => {
        const image_blob = await fetch(img.url).then((r) => r.blob())
        return {
          ...img,
          image_blob
        }
      }
    )
    const imageWithBlob = await Promise.all(imagePromises)
    return imageWithBlob
  } catch (err) {
    throw new Error(err)
  }
}

export const addBlobToImage = async (
  selectedImage: IMAGE_DATA
): Promise<IMAGE_RESPONSE_WITH_BLOB> => {
  try {
    const image_blob = await fetch(selectedImage.url).then((r) => r.blob())
    return {
      ...selectedImage,
      image_blob
    }
  } catch (err) {
    throw new Error(err)
  }
}

class ImageServices {
  services: SERVICE
  constructor(services: SERVICE) {
    // creating key-value pair, key -> name of service, value api key (easy to access)
    this.services = { ...services }
  }

  async getDataFromUnsplash(clientId: string, params: UNSPLASH): Promise<IMAGE_RESPONSE> {
    try {
      let paramsWithClientId = {
        ...params,
        client_id: clientId
      }
      const { data } = await axios.get(`${upload_base_url}/search/photos`, {
        params: paramsWithClientId
      })
      const { results } = data
      const images = results.map((image: any) => {
        return {
          id: image.id,
          width: image.width,
          height: image.height,
          color: image.color,
          name: image.alt_description || image.id, //TODO Determine image name from url
          url: image.urls.raw,
          siza_small_url: image.urls.small
        }
      })
      return { name: 'unsplash', images }
    } catch (error) {
      console.error(error)
      return { name: 'unsplash', error }
    }
  }

  async getDataFromPexels(clientId: string, params: PEXELS): Promise<IMAGE_RESPONSE> {
    try {
      const { data } = await axios.get(`${pexels_base_url}/search`, {
        params,
        headers: {
          Authorization: clientId
        }
      })
      const { photos } = data
      const images = photos.map((image: any) => {
        return {
          id: image.id,
          width: image.width,
          height: image.height,
          name: image.id, //TODO Determine image name from url
          url: image.src.original,
          siza_small_url: image.src.medium
        }
      })
      return { name: 'pexels', images }
    } catch (error) {
      console.error(error)
      return { name: 'pexels', error }
    }
  }

  async getDataFromPixabay(clientId: string, params: PIXABAY): Promise<IMAGE_RESPONSE> {
    try {
      const { query, ...rest } = params
      const newParams = { ...rest, key: clientId, q: query }
      const { data } = await axios.get(`${pixabay_base_url}`, {
        params: newParams
      })
      const { hits } = data
      const images = hits.map((image: any) => {
        return {
          id: image.id,
          width: image.previewWidth,
          height: image.previewHeight,
          name: image.id, //TODO Determine image name from url
          url: image.largeImageURL,
          siza_small_url: image.previewURL,
          imageSize: image.imageSize
        }
      })
      return { name: 'pixabay', images }
    } catch (error) {
      return { name: 'pixabay', error }
    }
  }

  async getDataFromShutterStock(
    clientId: SHUTTERSTOCK_INIT,
    params: SHUTTERSTOCK
  ): Promise<IMAGE_RESPONSE> {
    try {
      const { consumer_id, consumer_secret } = clientId
      let copyParams: any = { ...params }
      if (params['orientation'] === 'landscape') {
        copyParams = { ...params, orientation: 'horizontal' }
      } else if (params['orientation'] === 'portrait') {
        copyParams = { ...params, orientation: 'vertical' }
      }
      const tok = `${consumer_id}:${consumer_secret}`
      const hash = btoa(tok)
      const Basic = 'Basic ' + hash
      const { data } = await axios.get(`${shutterstock_base_url}/images/search`, {
        params: copyParams,
        headers: { Authorization: Basic }
      })
      const result = data.data // unsplash gives all the images in data and axios gives data in data so data.data
      const images = result.map((image: any) => {
        return {
          id: image.id,
          width: image.assets.preview.width,
          height: image.assets.preview.height,
          name: image.assets.description || image.id, //TODO Determine image name from url
          url: image.assets.url,
          siza_small_url: image.assets.huge_thumb.url
        }
      })
      return { name: 'shutterstock', images }
    } catch (error) {
      return { name: 'shutterstock', error }
    }
  }

  async getSpecificServiceData(
    inputParams: QUERY_PARAMS,
    service: SERVICENAME
  ): Promise<IMAGE_RESPONSE> {
    const clientId = this.services[service]
    if (!clientId) throw new Error(`Client ID does not exist for service ${service}`)
    if (
      service === 'unsplash' &&
      canMakeApiRequest(unsplash_allowed_props, inputParams) &&
      typeof clientId === 'string'
    ) {
      return await this.getDataFromUnsplash(clientId, inputParams)
    } else if (
      service === 'pexels' &&
      canMakeApiRequest(Pexels, inputParams) &&
      typeof clientId === 'string'
    ) {
      return await this.getDataFromPexels(clientId, inputParams)
    } else if (
      service === 'pixabay' &&
      canMakeApiRequest(pixabay_allowed_props, inputParams) &&
      typeof clientId === 'string'
    ) {
      return await this.getDataFromPixabay(clientId, inputParams)
    } else if (service === 'shutterstock' && typeof clientId === 'object') {
      return await this.getDataFromShutterStock(clientId, inputParams)
    } else {
      throw new Error('Service Passed does not exist or problem with input params')
    }
  }

  async getAllImages(inputParams: QUERY_PARAMS): Promise<Array<IMAGE_RESPONSE>> {
    const apiCallsToMake = []
    for (const [service, serviceKey] of Object.entries(this.services)) {
      if (service === 'unsplash' && canMakeApiRequest(unsplash_allowed_props, inputParams)) {
        apiCallsToMake.push(this.getDataFromUnsplash(serviceKey, inputParams))
      } else if (service === 'pexels' && canMakeApiRequest(Pexels, inputParams)) {
        apiCallsToMake.push(this.getDataFromPexels(serviceKey, inputParams))
      } else if (service === 'pixabay' && canMakeApiRequest(pixabay_allowed_props, inputParams)) {
        apiCallsToMake.push(this.getDataFromPixabay(serviceKey, inputParams))
      } else if (service === 'shutterstock') {
        apiCallsToMake.push(this.getDataFromShutterStock(serviceKey, inputParams))
      }
    }
    return Promise.all(apiCallsToMake).then((response) => response)
  }
}
export default ImageServices
