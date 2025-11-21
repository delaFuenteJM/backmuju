import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Servicio de correo: Listo para enviar emails con Gmail.");
  })
  .catch((err) => {
    console.error("Error al conectar con el servicio de correo:", err);
  });

export const sendPasswordResetEmail = async (userEmail, token) => {
  const resetLink = `${process.env.SERVER_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `Ecommerce Coder <${EMAIL_USERNAME}>`,
    to: userEmail,
    subject: "Restablecer Contraseña",
    html: `
            <h1>Restablecimiento de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz click en el botón a continuación:</p>
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                Restablecer mi Contraseña
            </a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
        `,
  };

  await transporter.sendMail(mailOptions);
};