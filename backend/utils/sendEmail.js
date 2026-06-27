const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SIGPRO-MINRESI" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

const verifyEmailTemplate = (name, link) => `
<div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #E5E7EB">
  <div style="text-align:center;margin-bottom:24px">
    <div style="width:56px;height:56px;background:#E8F4EF;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="font-size:28px;color:#1B4D3E">✉</span>
    </div>
    <h1 style="color:#1B4D3E;font-size:22px;margin:0">SIGPRO-MINRESI</h1>
    <p style="color:#6B7280;font-size:12px;margin:4px 0 0">Plateforme de Gestion des Projets de Recherche</p>
  </div>
  <h2 style="font-size:18px;color:#111827;margin:0 0 8px">Bonjour ${name},</h2>
  <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px">
    Merci de vous être inscrit sur SIGPRO-MINRESI. Veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
  </p>
  <div style="text-align:center;margin-bottom:24px">
    <a href="${link}" style="display:inline-block;background:#1B4D3E;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:14px">
      Vérifier mon email
    </a>
  </div>
  <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0">
    Ce lien expire dans <strong>24 heures</strong>. Si vous n'avez pas créé de compte, ignorez cet email.
  </p>
  <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0 16px"/>
  <p style="color:#D1D5DB;font-size:10px;text-align:center;margin:0">© 2025–2026 MINRESI — République du Cameroun</p>
</div>
`;

const resetPasswordTemplate = (name, link) => `
<div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #E5E7EB">
  <div style="text-align:center;margin-bottom:24px">
    <div style="width:56px;height:56px;background:#FEF2F2;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="font-size:28px;color:#DC2626">🔒</span>
    </div>
    <h1 style="color:#1B4D3E;font-size:22px;margin:0">SIGPRO-MINRESI</h1>
  </div>
  <h2 style="font-size:18px;color:#111827;margin:0 0 8px">Bonjour ${name},</h2>
  <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px">
    Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :
  </p>
  <div style="text-align:center;margin-bottom:24px">
    <a href="${link}" style="display:inline-block;background:#DC2626;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600;font-size:14px">
      Réinitialiser le mot de passe
    </a>
  </div>
  <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0">
    Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.
  </p>
  <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0 16px"/>
  <p style="color:#D1D5DB;font-size:10px;text-align:center;margin:0">© 2025–2026 MINRESI — République du Cameroun</p>
</div>
`;

module.exports = { sendEmail, verifyEmailTemplate, resetPasswordTemplate };
