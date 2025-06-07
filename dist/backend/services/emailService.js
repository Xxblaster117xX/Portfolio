import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// LOG para verificar que las variables se están cargando del archivo .env
console.log("=== CONFIGURACIÓN DE CORREO ===");
console.log("CORREO_ORIGEN:", process.env.CORREO_ORIGEN);
console.log("CORREO_PASSWORD:", process.env.CORREO_PASSWORD ? "CARGADA" : "NO CARGADA");
console.log("================================");
console.log('process.env: ', process.env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "gerrero1944@gmail.com",
    pass: "ijhhbaszbjorqcev"


  }
});

// Transportador de correo configurado para Gmail
const enviarCorreo = async (correoDestino, asunto, contenido) => {
  const mailOptions = {
    from: process.env.CORREO_ORIGEN,
    to: correoDestino,
    subject: asunto,
    text: contenido
  };
console.log('Enviando correo a:', correoDestino);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

export const enviarCodigoVerificacion = async (correoDestino, codigoVerificacion) => {
  const mensaje = `Por favor, utiliza el siguiente código para verificar tu cuenta: ${codigoVerificacion}`;
  await enviarCorreo(correoDestino, 'Verificación de cuenta', mensaje);
};

export const enviarCorreoRestablecerContrasena = async (correoDestino, enlaceRestablecimiento) => {
  const mensaje = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${enlaceRestablecimiento}`;
  await enviarCorreo(correoDestino, 'Restablecimiento de contraseña', mensaje);
};

export const enviarCorreoNotificacion = async (correoDestino, mensaje) => {
  await enviarCorreo(correoDestino, 'Notificación importante', mensaje);
};
