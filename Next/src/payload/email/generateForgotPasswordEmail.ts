import generateEmailHTML from "./generateEmailHTML";

const generateForgotPasswordEmail = async ({ token, user }): Promise<string> =>
  generateEmailHTML({
    headline: "Reset your password",
    content: `<p>
    Hey ${user.userName},
    </p> 
    <p>
    To set up a new password to your Weasker account, click "Reset Your Password" below, or use this link:
    <a style="color:#007BFF;" href=${process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL}/reset-password?token=${token}&user=${user.userName}>https://www.weasker.com/reset-password<a>
    </p>`,
    cta: {
      buttonLabel: "Reset your password",
      url: `${process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL}/reset-password?token=${token}&user=${user.userName}`,
    },
  });

export default generateForgotPasswordEmail;
