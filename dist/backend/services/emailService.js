import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Crear transportador con datos del entorno
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_ORIGEN,
    pass: process.env.CORREO_PASSWORD
  }
});

// Función genérica para enviar correo
const enviarCorreo = async (correoDestino, asunto, contenido) => {
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
    console.error(`Error al enviar correo:`, error);
  }
};

// Enviar código de verificación
export const enviarCodigoVerificacion = async (correoDestino, codigoVerificacion) => {
  const mensaje = `Por favor, utiliza el siguiente código para verificar tu cuenta: ${codigoVerificacion}`;
  await enviarCorreo(correoDestino, 'Verificación de cuenta', mensaje);
};

// Enviar enlace de restablecimiento de contraseña
export const enviarCorreoRestablecerContrasena = async (correoDestino, enlaceRestablecimiento) => {
  const mensaje = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${enlaceRestablecimiento}`;
  await enviarCorreo(correoDestino, 'Restablecimiento de contraseña', mensaje);
};

// Enviar notificación genérica
export const enviarCorreoNotificacion = async (correoDestino, mensaje) => {
  await enviarCorreo(correoDestino, 'Notificación importante', mensaje);
};
