export const video = {
  name: "video",
  title: "Video File",
  type: "object",
  fields: [
    {
      name: "file",
      title: "Upload Video",
      type: "file",
      options: {
        accept: "video/*",
      },
      description: "Upload a video file",
    },
  ],
};
