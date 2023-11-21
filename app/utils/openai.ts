import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

export const removePersonalInformation = async (
  message: string,
): Promise<string> => {
  const prompt: string = `The following is a message from someone to another person. Extract every information that indicates names, contact information, and addresses and return the unchanged version of other content of the message. replace that information with [removed content]:\n\n${message}\n\n`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ content: prompt, role: "system" }],
    });
    const redactedMessage = response.choices[0].message.content;
    return redactedMessage as string;
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
};
