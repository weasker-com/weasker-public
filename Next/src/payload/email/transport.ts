let email;

if (process.env.NODE_ENV === "production") {
  email = {
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    fromName: "Weasker",
    fromAddress: "noreply@weasker.com",
  };
} else {
  email = {
    fromName: "Ethereal Email",
    fromAddress: "example@ethereal.com",
    logMockCredentials: true,
  };
}

export default email;
