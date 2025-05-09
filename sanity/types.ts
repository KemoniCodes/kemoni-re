/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Blog = {
  _id: string;
  _type: "blog";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  subTitle?: string;
  allFilters?: Array<
    | "\uD83C\uDFE1 Buyers"
    | "\uD83D\uDCB0 Sellers"
    | "\uD83D\uDCB3 Finance"
    | "\uD83D\uDCC8 Market"
    | "\uD83C\uDF78 Lifestyle"
    | "\uD83D\uDDBC\uFE0F Design"
    | "\uD83D\uDCF0 News"
    | "\uD83E\uDEA9 Events"
    | "\uD83D\uDCBB Tech"
  >;
  articles?: Array<{
    articleThumbnail?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      alt?: string;
      _type: "image";
    };
    articleDate?: string;
    articleTitle?: string;
    filters?: Array<
      | "\uD83C\uDFE1 Buyers"
      | "\uD83D\uDCB0 Sellers"
      | "\uD83D\uDCB3 Finance"
      | "\uD83D\uDCC8 Market"
      | "\uD83C\uDF78 Lifestyle"
      | "\uD83D\uDDBC\uFE0F Design"
      | "\uD83D\uDCF0 News"
      | "\uD83E\uDEA9 Events"
      | "\uD83D\uDCBB Tech"
    >;
    articleText?: Array<{
      children?: Array<{
        marks?: Array<string>;
        text?: string;
        _type: "span";
        _key: string;
      }>;
      style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
      listItem?: "bullet" | "number";
      markDefs?: Array<{
        href?: string;
        _type: "link";
        _key: string;
      }>;
      level?: number;
      _type: "block";
      _key: string;
    }>;
    _key: string;
  }>;
};

export type Neighborhoods = {
  _id: string;
  _type: "neighborhoods";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  mapFilters?: Array<{
    emoji?: string;
    filterTitle?: string;
    _key: string;
  }>;
  neighborhood?: Array<{
    nHMainImg?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      alt?: string;
      _type: "image";
    };
    neighborhoodName?: string;
    neighborhoodLink?: Slug;
    neighborhoodGuide?: {
      neighborhoodTagline?: string;
      overallVibe?: string;
      highlights?: Array<string>;
      whoLives?: {
        whoLivesText?: string;
        whoLivesDataCallouts?: {
          totalPopulation?: string;
          medianAge?: number;
          aII?: string;
        };
      };
      gettingAround?: {
        gettingAroundText?: string;
        walkabilityScore?: number;
        transitScore?: number;
      };
      realEstate?: {
        realEstateText?: string;
        averageHomePrice?: string;
        averageRentPrice?: string;
        architecturalStyle?: Array<string>;
      };
    };
    _key: string;
  }>;
};

export type MeetMe = {
  _id: string;
  _type: "meetMe";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  shortBio?: string;
  portrait?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  myCommitment?: Array<{
    commitmentTtile?: string;
    commitmentDesc?: string;
    _key: string;
  }>;
  buyersJourney?: Array<{
    buyerStep?: string;
    buyerStepDesc?: string;
    _key: string;
  }>;
  sellersJourney?: Array<{
    sellerStep?: string;
    sellerStepDesc?: string;
    _key: string;
  }>;
};

export type Properties = {
  _id: string;
  _type: "properties";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  property?: Array<{
    homeThumbnail?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      alt?: string;
      _type: "image";
    };
    gallery?: Array<{
      image?: {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
      };
      alt?: string;
      _type: "galleryImg";
      _key: string;
    }>;
    description?: string;
    highlights?: Array<string>;
    neighborhoodMapFilters?: Array<{
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      _key: string;
      [internalGroqTypeReferenceTo]?: "neighborhoods";
    }>;
    address?: {
      line1?: string;
      line2?: string;
    };
    area?:
      | "beverly-hills"
      | "santa-monica"
      | "west-hollywood"
      | "beverly-grove"
      | "hollywood-hills"
      | "los-feliz"
      | "brentwood"
      | "bel-air"
      | "studio-city"
      | "culver-city";
    bedrooms?: number;
    bathrooms?: number;
    sqft?: string;
    price?: string;
    homeURL?: Slug;
    propertyType?: "for-sale" | "for-lease";
    homeType?: "residential" | "condo" | "townhome";
    _key: string;
  }>;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type Hero = {
  _id: string;
  _type: "hero";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  bgImg?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  heroText?: string;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type AllSanitySchemaTypes =
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityFileAsset
  | Geopoint
  | Blog
  | Neighborhoods
  | MeetMe
  | Properties
  | Slug
  | Hero
  | SanityImageCrop
  | SanityImageHotspot
  | SanityImageAsset
  | SanityAssetSourceData
  | SanityImageMetadata;
export declare const internalGroqTypeReferenceTo: unique symbol;
