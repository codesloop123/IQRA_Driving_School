const axios = require("axios");

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendWhatsAppText(templateName, variables = [], code) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: "923219555501", // Or pass recipient as a param
        type: "template",
        template: {
          name: templateName,
          language: { code: code }, // Change language if needed
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

  // try {
  //   const response = await axios.post(
  //     `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
  //     {
  //       messaging_product: "whatsapp",
  //       to: "923219555501", // recipient's number in international format
  //       type: "template",
  //       template: {
  //         name: "hello_world", // Meta provides this default template
  //         language: { code: "en_US" }, // must match template settings
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   console.log("Message sent:", response.data);
  // } catch (error) {
  //   console.error(
  //     "Error sending message:",
  //     error.response?.data || error.message
  //   );
  // }
}
module.exports = sendWhatsAppText;
