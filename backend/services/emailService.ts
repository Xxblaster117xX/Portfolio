import nodemailer from 'nodemailer';

// Crear un transportador para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos el servicio de Gmail. 
  auth: {
    user: 'acarreterog01@santiagoapostol.net', 
    pass: '19/02/2001' 
  }
});

// Función para enviar un correo de verificación 
export const enviarCorreoVerificacion = (correoDestino: string, codigoVerificacion: string) => {
  const mailOptions = {
    from: 'acarreterog01@santiagoapostol.net', 
    to: correoDestino,
    subject: 'Verificación de cuenta',
    text: `Por favor, utiliza el siguiente código para verificar tu cuenta: ${codigoVerificacion}`
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar correo: ', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// Función para enviar un correo de restablecimiento de contraseña
export const enviarCorreoRestablecerContrasena = (correoDestino: string, enlaceRestablecimiento: string) => {
  const mailOptions = {
    from: 'acarreterog01@santiagoapostol.net',    
    to: correoDestino,
    subject: 'Restablecimiento de contraseña',
    text: `Para restablecer tu contraseña, por favor haz clic en el siguiente enlace: ${enlaceRestablecimiento}`
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar correo: ', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// Función para enviar un correo de notificación (por ejemplo, al registrar un nuevo usuario)
export const enviarCorreoNotificacion = (correoDestino: string, mensaje: string) => {
  const mailOptions = {
    from: 'acarreterog01@santiagoapostol.net', 
    to: correoDestino,
    subject: 'Notificación importante',
    text: mensaje
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar correo: ', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};
