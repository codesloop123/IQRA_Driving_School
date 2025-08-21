const axios = require("axios");

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendWhatsAppText(templateName, variables = []) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: "923095555855", // Or pass recipient as a param
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" }, // Change language if needed
          components: [
            {
              type: "body",
              parameters: variables.map((value) => ({
                type: "text",
                text: value || "N/A",
              })),
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Template '${templateName}' sent:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to send template '${templateName}':`,
      error.message
    );
    throw error;
  }
}
module.exports = sendWhatsAppText;
