import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configura el transportador SMTP con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_ORIGEN,
    pass: process.env.CORREO_PASSWORD
  }
});

// Función genérica para enviar correos
const enviarCorreo = async (correoDestino: string, asunto: string, contenido: string) => {
  const mailOptions = {
    from: process.env.CORREO_ORIGEN,
    to: correoDestino,
    subject: asunto,
    text: contenido
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado: ${info.response}`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};

// Enviar código de verificación
export const enviarCodigoVerificacion = async (correoDestino: string, codigoVerificacion: string) => {
  const mensaje = `Por favor, utiliza el siguiente código para verificar tu cuenta: ${codigoVerificacion}`;
  await enviarCorreo(correoDestino, 'Verificación de cuenta', mensaje);
};

// Enviar enlace de restablecimiento de contraseña
export const enviarCorreoRestablecerContrasena = async (correoDestino: string, enlaceRestablecimiento: string) => {
  const mensaje = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${enlaceRestablecimiento}`;
  await enviarCorreo(correoDestino, 'Restablecimiento de contraseña', mensaje);
};

// Enviar notificación genérica
export const enviarCorreoNotificacion = async (correoDestino: string, mensaje: string) => {
  await enviarCorreo(correoDestino, 'Notificación importante', mensaje);
};
