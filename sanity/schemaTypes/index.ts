import { type SchemaTypeDefinition } from 'sanity'
import { featuredListingsType } from './featuredListings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [featuredListingsType],
}
