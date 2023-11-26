export const imagesSchema = {
  name: "images",
  type: "array",
  title: "Images",
  of: [
    {
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
  ],
  options: {
    layout: "grid",
  },
};
