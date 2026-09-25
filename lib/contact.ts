// Shared between the contact form (client) and the API route (server), so both validate the same way.

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export const limits = { name: 100, email: 200, company: 120, message: 5000, messageMin: 10 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns field → error message. Empty object means valid.
export function validate(input: Partial<Record<keyof ContactInput, unknown>>) {
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(input.name);
  if (!name) errors.name = "I'd love to know who's saying hi.";
  else if (name.length > limits.name) errors.name = "That name is a bit long for my inbox.";

  const email = str(input.email);
  if (!email) errors.email = "I'll need an email to write back.";
  else if (email.length > limits.email || !EMAIL.test(email)) errors.email = "That email doesn't look quite right.";

  if (str(input.company).length > limits.company) errors.company = "Keep it under 120 characters.";

  const message = str(input.message);
  if (message.length < limits.messageMin) errors.message = "Give me a little more to go on (10+ characters).";
  else if (message.length > limits.message) errors.message = "Love the enthusiasm. Keep it under 5,000 characters.";

  return errors;
}
