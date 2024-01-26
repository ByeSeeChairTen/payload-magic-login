import { CollectionConfig } from 'payload/types'

const userCollection: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: 'salt',
      hidden: true,
      type: 'text',
    },
    {
      name: 'hash',
      hidden: true,
      type: 'text',
    },
  ],
}

export default userCollection;