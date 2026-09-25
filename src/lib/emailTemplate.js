import { getLocalClubTime } from "./dateUtils";

export function generateLeadEmailHtml({
  fullName = "",
  fullInternationalPhone = "",
  goal = "-",
  selectedBranch = "-",
  selectedSummary = "",
  oneClickWaLink = "#",
  formattedDateTime = null,
  lang = "ar",
}) {
  const isAr = lang === "ar";
  const direction = isAr ? "rtl" : "ltr";

  // اگر مقدار مستقیم پاس داده نشده بود، به صورت خودکار زمان محلی باشگاه را محاسبه می‌کند
  const displayTime = formattedDateTime || getLocalClubTime().formattedDateTime;

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isAr ? "إشعار تسجيل مشترك جديد" : "New Member Registration Alert"}</title>
    </head>
    <body style="margin: 0; padding: 24px 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; padding: 0 16px;">
        <tr>
          <td>
            <div style="background-color: #141414; border: 1px solid #262626; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
              
              <!-- هدر ایمیل -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="${isAr ? "right" : "left"}">
                    <span style="display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.35); color: #D4AF37; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⚡ ${isAr ? "فرصة اشتراك جديدة" : "New Priority Lead"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="${isAr ? "right" : "left"}" style="padding-top: 14px;">
                    <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 900; margin: 0; line-height: 1.3;">
                      ${isAr ? "طلب تصريح وتجربة رياضية جديد" : "New Free Day Pass & Inquiry"}
                    </h1>
                    <p style="color: #A3A3A3; font-size: 13px; margin: 6px 0 0 0;">
                      ${isAr ? "تم استلام بيانات مشترك مهتم عبر الموقع الرسمي للنادي" : "Received via the official athletic landing page"}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- جدول مشخصات لید -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #262626; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #888888; font-size: 13px; width: 35%;">
                    ${isAr ? "اسم العميل" : "Full Name"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #FFFFFF; font-size: 14px; font-weight: 700; text-align: ${isAr ? "left" : "right"};">
                    ${fullName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #888888; font-size: 13px;">
                    ${isAr ? "رقم الهاتف" : "Phone (WhatsApp)"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #FFFFFF; font-size: 14px; font-weight: 700; font-family: monospace; text-align: ${isAr ? "left" : "right"};" dir="ltr">
                    +${fullInternationalPhone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #888888; font-size: 13px;">
                    ${isAr ? "الهدف البدني" : "Fitness Goal"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #34D399; font-size: 13px; font-weight: 600; text-align: ${isAr ? "left" : "right"};">
                    ${goal}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #888888; font-size: 13px;">
                    ${isAr ? "الفرع المطلوب" : "Target Branch"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #FFFFFF; font-size: 13px; font-weight: 500; text-align: ${isAr ? "left" : "right"};">
                    ${selectedBranch}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #888888; font-size: 13px;">
                    ${isAr ? "الخيارات المحددة" : "Selected Target"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; color: #D4AF37; font-size: 13px; font-weight: 700; text-align: ${isAr ? "left" : "right"};">
                    ${selectedSummary || (isAr ? "تصريح دخول عام" : "General Pass")}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #888888; font-size: 13px;">
                    ${isAr ? "وقت التسجيل المحلي" : "Local Submission Time"}
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #262626; color: #D4AF37; font-size: 13px; font-weight: 600; text-align: ${isAr ? "left" : "right"};" dir="ltr">
                    ${displayTime}
                  </td>
                </tr>
              </table>

              <!-- دکمه CTA واتساپ -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${oneClickWaLink}" target="_blank" style="display: block; background: linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%); color: #0A0A0A; text-decoration: none; font-size: 14px; font-weight: 900; text-align: center; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(212, 175, 55, 0.25);">
                      💬 ${isAr ? "فتح محادثة واتساب فوراً مع المشترك" : "Chat Instantly on WhatsApp"}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- فوتر ایمیل -->
              <p style="text-align: center; color: #555555; font-size: 11px; margin-top: 28px; margin-bottom: 0;">
                PrimeFit Athletic Club • Real-time Lead Automation System
              </p>

            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
