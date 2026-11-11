/**
 * EMAIL SERVICE (Resend API)
 * Obsługa automatycznej wysyłki powiadomień i faktur proforma z domeny poruszek.pl
 */

import { exec } from 'node:child_process';
import util from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const execPromise = util.promisify(exec);

/**
 * Konwertuje kod HTML faktury na bufor PDF przy użyciu headless Google Chrome.
 * W razie braku/błędu zwraca null (fallback na załącznik HTML).
 */
export async function convertHtmlToPdfBuffer(htmlString) {
  const tmpDir = os.tmpdir();
  const rand = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const tmpHtml = path.join(tmpDir, `inv-${rand}.html`);
  const tmpPdf = path.join(tmpDir, `inv-${rand}.pdf`);

  try {
    fs.writeFileSync(tmpHtml, htmlString, 'utf8');
    await execPromise(`google-chrome --headless --disable-gpu --no-sandbox --print-to-pdf="${tmpPdf}" "file://${tmpHtml}"`, { timeout: 8000 });
    if (fs.existsSync(tmpPdf)) {
      const pdfBuffer = fs.readFileSync(tmpPdf);
      try { fs.unlinkSync(tmpPdf); } catch (e) {}
      try { fs.unlinkSync(tmpHtml); } catch (e) {}
      return pdfBuffer;
    }
  } catch (err) {
    console.warn('[PDF Generator] Headless Chrome PDF generation failed, using HTML fallback:', err.message);
  } finally {
    if (fs.existsSync(tmpHtml)) try { fs.unlinkSync(tmpHtml); } catch (e) {}
    if (fs.existsSync(tmpPdf)) try { fs.unlinkSync(tmpPdf); } catch (e) {}
  }
  return null;
}

/**
 * Wysyła wiadomość e-mail przez Resend API
 */
export async function sendReservationEmail({
  to,
  name,
  group,
  amountPln,
  invoiceNumber,
  invoiceId,
  invoiceHtml,
  transfer = null,
  isZeroPayment = false,
  buyer = null
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[EmailService] Brak RESEND_API_KEY w .env – pomijam wysyłkę e-mail.');
    return { success: false, error: 'Brak klucza API' };
  }

  const fromAddress = process.env.RESEND_FROM || 'Łukasz Poruszek <kontakt@poruszek.pl>';
  const adminEmail = process.env.ADMIN_EMAIL || 'lukasz.main@gmail.com';
  const baseUrl = process.env.BASE_URL || 'https://lukasz.poruszek.pl';
  const invoiceOnlineUrl = `${baseUrl}/api/invoices/${invoiceId}`;

  const cleanInvName = String(invoiceNumber || 'Proforma').replace(/[\/\\]/g, '_');
  const subject = isZeroPayment
    ? `Potwierdzenie bezpłatnej rezerwacji: Warsztaty AI (${invoiceNumber})`
    : `Potwierdzenie rezerwacji Warsztatów AI – Faktura Proforma ${invoiceNumber}`;

  // Przygotowanie załącznika PDF lub HTML
  const attachments = [];
  if (invoiceHtml) {
    const pdfBuf = await convertHtmlToPdfBuffer(invoiceHtml);
    if (pdfBuf) {
      attachments.push({
        filename: `Faktura_Proforma_${cleanInvName}.pdf`,
        content: pdfBuf.toString('base64')
      });
      console.log(`[EmailService] Przygotowano załącznik PDF (${Math.round(pdfBuf.length / 1024)} KB) dla ${invoiceNumber}`);
    } else {
      attachments.push({
        filename: `Faktura_Proforma_${cleanInvName}.html`,
        content: Buffer.from(invoiceHtml, 'utf8').toString('base64')
      });
      console.log(`[EmailService] Przygotowano załącznik HTML dla ${invoiceNumber}`);
    }
  }

  // Szablon wiadomości HTML (minimalistyczny, luksusowy design e-mail)
  const emailHtml = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background-color: #f8fafc; margin: 0; padding: 32px 16px; font-size: 14px; line-height: 1.6; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
    .email-header { background: #0f172a; padding: 28px 32px; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .email-header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
    .email-body { padding: 32px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
    .intro-text { color: #334155; margin-bottom: 24px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .details-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .details-table tr:last-child td { border-bottom: none; }
    .td-label { color: #64748b; font-weight: 500; width: 38%; }
    .td-val { color: #0f172a; font-weight: 700; }
    .payment-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .payment-box-title { font-size: 13px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .payment-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .payment-label { color: #15803d; font-weight: 500; }
    .payment-val { font-family: ui-monospace, Menlo, Consolas, monospace; font-weight: 700; color: #14532d; }
    .action-btn { display: inline-block; background: #0f172a; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 6px; margin: 12px 0 20px; }
    .note-box { font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Warsztaty Praktycznego AI</h1>
      <p>Potwierdzenie rezerwacji miejsca • ${group}</p>
    </div>

    <div class="email-body">
      <div class="greeting">Dzień dobry ${name},</div>

      <div class="intro-text">
        Dziękuję za zgłoszenie na warsztaty. Twoja wstępna rezerwacja została zarejestrowana pod numerem <strong>${invoiceNumber}</strong>. 
        Poniżej znajdziesz podsumowanie rezerwacji oraz dane niezbędne do realizacji płatności.
      </div>

      <table class="details-table">
        <tr>
          <td class="td-label">Wybrany cykl:</td>
          <td class="td-val">${group}</td>
        </tr>
        <tr>
          <td class="td-label">Uczestnik / Dane:</td>
          <td class="td-val">${name} (${to})</td>
        </tr>
        ${buyer && buyer.nip ? `
        <tr>
          <td class="td-label">NIP nabywcy:</td>
          <td class="td-val">${buyer.nip}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="td-label">Kwota:</td>
          <td class="td-val" style="font-size: 16px;">${amountPln.toLocaleString('pl-PL')} PLN brutto</td>
        </tr>
      </table>

      ${transfer ? `
      <div class="payment-box">
        <div class="payment-box-title">💳 Dane do przelewu bankowego (Termin: 24h)</div>
        <div class="payment-row">
          <span class="payment-label">Numer rachunku:</span>
          <span class="payment-val">${transfer.accountFormatted}</span>
        </div>
        <div class="payment-row">
          <span class="payment-label">Odbiorca:</span>
          <span class="payment-val">${transfer.recipient}</span>
        </div>
        <div class="payment-row">
          <span class="payment-label">Tytuł przelewu:</span>
          <span class="payment-val">${transfer.title}</span>
        </div>
        <div class="payment-row">
          <span class="payment-label">Kwota:</span>
          <span class="payment-val">${transfer.amountFormatted}</span>
        </div>
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${invoiceOnlineUrl}" class="action-btn" target="_blank">
          📄 Zobacz Fakturę Proforma online
        </a>
      </div>

      <div class="note-box">
        <strong>Załącznik:</strong> Do niniejszej wiadomości załączono Fakturę Proforma w formacie PDF.<br>
        Miejsce na warsztatach pozostaje zarezerwowane przez 24 godziny. Po zaksięgowaniu wpłaty otrzymasz potwierdzenie uczestnictwa, materiały wstępne oraz e-Fakturę VAT zgodną ze standardem KSeF.<br><br>
        W razie jakichkolwiek pytań wystarczy odpowiedzieć bezpośrednio na tę wiadomość e-mail.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const payload = {
      from: fromAddress,
      to: [to],
      bcc: [adminEmail],
      reply_to: adminEmail,
      subject: subject,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.id) {
      console.log(`[EmailService] Pomyślnie wysłano e-mail potwierdzający do ${to} (BCC: ${adminEmail}). Resend ID: ${data.id}`);
      return { success: true, id: data.id };
    } else {
      console.error('[EmailService] Błąd wysyłki e-mail przez Resend:', res.status, data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error('[EmailService] Wyjątek podczas wysyłki e-mail:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Wysyła natychmiastowe powiadomienie do Łukasza o nowym zgłoszeniu na listę rezerwową lub propozycji terminu
 */
export async function sendWaitlistNotificationEmail({ email, note, type, month, isProposal = false }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: 'Brak klucza API' };

  const fromAddress = process.env.RESEND_FROM || 'Łukasz Poruszek <kontakt@poruszek.pl>';
  const adminEmail = process.env.ADMIN_EMAIL || 'lukasz.main@gmail.com';

  const actionTitle = isProposal ? 'Własna propozycja terminu mentoringu' : 'Zgłoszenie na listę rezerwową';
  const subject = `[${actionTitle}] ${type} • ${email}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; padding: 24px; background: #f8fafc;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px;">
    <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">${actionTitle}</h2>
    <p style="color: #64748b; font-size: 13px; margin: 0 0 20px;">Nowe zgłoszenie z formularza na stronie lukasz.poruszek.pl</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 35%; font-size: 13px;">Adres e-mail:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 13px;"><a href="mailto:${email}">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Typ konsultacji:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 13px;">${type}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Miesiąc:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-size: 13px;">${month}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; vertical-align: top; font-size: 13px;">Wiadomość / Propozycja:</td>
        <td style="padding: 8px 0; color: #0f172a; font-size: 13px; line-height: 1.5;">${note ? String(note).replace(/\n/g, '<br>') : '<em>Brak dodatkowej notatki</em>'}</td>
      </tr>
    </table>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11.5px; color: #94a3b8;">
      Wiadomość wygenerowana automatycznie przez system rezerwacji lukasz.poruszek.pl
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        reply_to: email,
        subject,
        html
      })
    });
    const data = await res.json();
    if (res.ok && data.id) {
      console.log(`[EmailService] Wysłano powiadomienie waitlist/propozycji do ${adminEmail}. Resend ID: ${data.id}`);
      return { success: true, id: data.id };
    }
    return { success: false, error: data };
  } catch (err) {
    console.error('[EmailService] Błąd powiadomienia waitlist:', err);
    return { success: false, error: err.message };
  }
}
