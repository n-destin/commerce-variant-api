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
    console.error("Error making APoI request:", error);
    throw error;
  }
};
