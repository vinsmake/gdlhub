import nodemailer from 'nodemailer';

// Configuración del transporter de email
// Para testing, usaremos Ethereal (servicio de prueba)
// En producción, cambiar por un servicio real como Gmail, SendGrid, etc.
export const createEmailTransporter = async () => {
  // Para desarrollo, crear cuenta de prueba
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  return transporter;
};

// Para producción (Gmail example)
export const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // tu-email@gmail.com
      pass: process.env.EMAIL_PASS  // tu-contraseña-de-app
    }
  });
};

// Generar código de verificación de 6 dígitos
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Enviar email de verificación
export const sendVerificationEmail = async (email, verificationCode, userName) => {
  console.log('📧 [EMAIL] Preparando envío de email de verificación...');
  
  try {
    const transporter = await createEmailTransporter();
    
    const mailOptions = {
      from: '"GDL Hub" <noreply@gdlhub.com>',
      to: email,
      subject: '🔐 Confirma tu cuenta en GDL Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0;">GDL Hub</h1>
            <p style="color: #666; margin: 10px 0 0 0;">¡Bienvenido a nuestra comunidad!</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">¡Hola ${userName}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Gracias por registrarte en GDL Hub. Para completar tu registro, 
              por favor confirma tu dirección de correo electrónico usando el siguiente código:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #dc2626; color: white; padding: 20px 40px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
              <strong>⏰ Este código expira en 15 minutos.</strong><br>
              Si no solicitaste esta cuenta, puedes ignorar este email.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; color: #999; font-size: 12px;">
            <p>GDL Hub - Descubre los mejores restaurantes de Guadalajara</p>
          </div>
        </div>
      `,
      text: `
        ¡Hola ${userName}!
        
        Gracias por registrarte en GDL Hub.
        
        Tu código de verificación es: ${verificationCode}
        
        Este código expira en 15 minutos.
        
        Si no solicitaste esta cuenta, puedes ignorar este email.
        
        - Equipo GDL Hub
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ [EMAIL] Email enviado exitosamente');
    console.log('📧 [EMAIL] Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('❌ [EMAIL] Error enviando email:', error);
    throw error;
  }
};