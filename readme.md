## Images-map

`images-map` is a simple library which maps response from various images api and returns to user (**written in typescript**).

Currently `images-map` supports `unsplash, pexels, pixabay and shutterstock`

## Note

- if you find this repo interesting do not forgot to give it a star.
- Create issue for service or feature you wish this library to have (should be added with 2-5 days)
- If you find a bug, open an issue on github and author would fix it within 24 hours
- You can find default response of all the api in documentation folder

## Installation

`npm install images-map --save`

or

`yarn add images-map`

## Usage

#### Get Api keys

Currently library supports getting images from

- unsplash
- pexels
- pixabay
- shutterstock

#### Create env object

Create `env object` with keys of services you want to use (skip the ones you don't)

```
let env_variables = {
  unsplash: "7fzpM8WE8YdUrkCPkxCVF2qrhnxYJKEgbxW5_5ywfko",
  pexels: "563492ad6f91700001000001d95e696f46034c75a28b9b0c57fffb62",
  giphy: "Ev0XdFOjjnl5iyx9uoBm9Dwcdgld2ETA",
  pixabay: "17716537-c49aa5a43713abefd73673b3b",
  shutterstock: {
    consumer_id: "opakkzFRKVEIpT6Amt75hZzsjAdrHnAq",
    consumer_secret: "izbMPYhShAb5xYGg",
  },
}
```

<strong> Note: </strong> Shutterstock requires `consumer_id` and `consumer_secret`

#### Initalise the service

```
import ImageServices, {
  QUERY_PARAMS,
  IMAGE_RESPONSE,
  IMAGE_DATA,
  SERVICENAME
} from "images-map";

const InitImageService = new ImageServices(EnvironmentVariables);
```

### Endpoints

### Get all images data

To get images for all the endpoints, create a query object and send it to `InitImageService`

```
const response = await InitImageService.getAllImages(query);
```

Here `query` is an **object** containing image filters

#### Query Object

| **Value**  | **Type**                              | **Default** | **Required** | **description**                                 | **example** |
| ---------- | ------------------------------------- | ----------- | ------------ | ----------------------------------------------- | ----------- |
| query      | string                                | none        | yes          | search string for which you want to get results | london      |
| min_height | string                                | null        | no           | minimum height for imabe                        | 128         |
| min_width  | string                                | null        | No           | minimum width for the image                     | 128         |
| max_width  | string                                | null        | no           | maximum width for the image                     | 642         |
| max_height | string                                | null        | no           | maximum height for the image                    | 728         |
| color      | string                                | null        | null         | color peference for the image (comiing soon)    | 'red'       |
| image_type | `photo` or `illustration` or `vector` | no          | no           | what type of image you want                     | "photo"     |
| order      | `latest` or `relavent`                | no          | no           | what sort of image you want                     | `relavent`  |
| page       | number                                | no          | no           | use this to get more images or for pagination   | 2           |
| per_page   | number                                | no          | no           | number of results per page                      | 20          |

#### Response

```
 [{
  name: {{SERVICENAME}},
  images: {
    width: number
    height: number
    color: string
    url: string
    name: string
    id: string
    siza_small_url: string
    imageSize?: string
  }
  error?: any
}]
```

### Get image data from single service

```
const specificServiceData = await InitImageService.getSpecificServiceData(query)
```

Where `query` **Object** is same as above

#### Response

```
 [{
  name: {{SERVICENAME}},
  images: {
    width: number
    height: number
    color: string
    url: string
    name: string
    id: string
    siza_small_url: string
    imageSize?: string
  }
  error?: any
}]
```

### Add blob to images

We have function not coupled with our main class, to use that you need to first `import` it

`import {addBlobToImages} from 'images-map`

and then pass the arrays of image objects recived from the image service

```
  const imagesWithBlob = await addBlobToImages(
    images
  );
```

this will return Array of images with blob in it

```
 [{
  width?: number
  height?: number
  color?: string
  url: string
  name: string
  id: string
  small_url?: string
  imageSize?: string
  image_blob: blob
}]
```

### Add blob to image

`import {addBlobToImage} from 'images-map`

and the pass the Image Object recieved from image service

```
  const imagesWithBlob = await addBlobToImages(
    image
  );
```

and it will return the image object with blob

```
{
  width?: number
  height?: number
  color?: string
  url: string
  name: string
  id: string
  small_url?: string
  imageSize?: string
  image_blob: blob
}
```
