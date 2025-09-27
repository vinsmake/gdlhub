import nodemailer from "nodemailer";

export const createEmailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Tu email de Gmail
      pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
    }
  });
  return transporter;
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email, code, userName) => {
  console.log("📧 [EMAIL] Enviando código de verificación a:", email);
  
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"GDL Hub" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🍽️ Confirma tu cuenta en GDL Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 32px;">🍽️ GDL Hub</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">¡Bienvenido a nuestra comunidad gastronómica!</p>
            </div>
            
            <h2 style="color: #333; margin: 0 0 20px 0;">¡Hola ${userName}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              Gracias por registrarte en GDL Hub. Para completar tu registro y comenzar a descubrir los mejores restaurantes de Guadalajara, 
              confirma tu correo electrónico con el siguiente código:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 25px 50px; border-radius: 12px; font-size: 36px; font-weight: bold; letter-spacing: 6px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);">
                ${code}
              </div>
            </div>
            
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="color: #dc2626; margin: 0; font-weight: bold;">⏰ Este código expira en 15 minutos</p>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
                Si no solicitaste esta cuenta, puedes ignorar este email de forma segura.
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0 0 0; padding: 20px 0; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                GDL Hub - Descubre, califica y comparte los mejores sabores de Guadalajara
              </p>
              <p style="color: #ccc; font-size: 12px; margin: 10px 0 0 0;">
                Este es un email automático, no responder a este mensaje.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `¡Hola ${userName}! Gracias por registrarte en GDL Hub. Tu código de verificación es: ${code}. Este código expira en 15 minutos. Si no solicitaste esta cuenta, ignora este email.`
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ [EMAIL] Email enviado exitosamente a:", email);
    console.log("📧 [EMAIL] Message ID:", info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      email: email
    };
    
  } catch (error) {
    console.error("❌ [EMAIL] Error enviando email:", error);
    throw error;
  }
};