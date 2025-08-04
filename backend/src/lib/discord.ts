"use server";

export const sendInbox = async ({ email }: { email: string }) => {
  try {
    await fetch(process.env.DISCORD_WEBHOOK_URL_INBOX!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "NEW waitlist subscriber - GymSimple! ✅",
            fields: [
              {
                name: "Email",
                value: `${email}`,
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    console.error(error);
  }
};
