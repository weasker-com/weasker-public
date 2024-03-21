let email;

if (process.env.NODE_ENV === "production") {
  email = {
    fromName: "Weasker",
    fromAddress: "contact@weasker.com",
    transportOptions: {},
  };
} else {
  email = {
    fromName: "Ethereal Email",
    fromAddress: "example@ethereal.com",
    logMockCredentials: true,
  };
}

export default email;
