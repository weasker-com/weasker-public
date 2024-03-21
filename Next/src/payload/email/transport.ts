let email;

if (process.env.NODE_ENV === "production") {
  email = {
    fromName: "Weasker",
    fromAddress: "info@payloadcms.com",
    transportOptions: {
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "username",
        pass: "password",
      },
    },
  };
} else {
  email = {
    fromName: "Ethereal Email",
    fromAddress: "example@ethereal.com",
    logMockCredentials: true,
  };
}

export default email;
