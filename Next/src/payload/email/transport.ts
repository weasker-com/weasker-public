let email;

if (process.env.NODE_ENV === "production") {
  email = {
    transportOptions: {
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: "username",
        pass: "password",
      },
    },
    fromName: "Weasker",
    fromAddress: "contact@weasker.com",
  };
} else {
  email = {
    fromName: "Ethereal Email",
    fromAddress: "example@ethereal.com",
    logMockCredentials: true,
  };
}

export default email;
