import crypto from "crypto";

export const generateOrderCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
