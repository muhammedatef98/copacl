export type RecognizedContentType = "url" | "email" | "phone" | "text";

export interface RecognizedContent {
  type: RecognizedContentType;
  value: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
const PHONE_REGEX = /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g;

export function recognizeContent(content: string): RecognizedContent {
  // Check for URL
  if (URL_REGEX.test(content)) {
    const url = content.match(URL_REGEX)?.[0] || content;
    return {
      type: "url",
      value: content,
      action: {
        label: "Open Link",
        handler: () => window.open(url, "_blank"),
      },
    };
  }

  // Check for email
  if (EMAIL_REGEX.test(content)) {
    const email = content.match(EMAIL_REGEX)?.[0] || content;
    return {
      type: "email",
      value: content,
      action: {
        label: "Send Email",
        handler: () => window.open(`mailto:${email}`, "_blank"),
      },
    };
  }

  // Check for phone number
  if (PHONE_REGEX.test(content)) {
    const phone = content.match(PHONE_REGEX)?.[0] || content;
    return {
      type: "phone",
      value: content,
      action: {
        label: "Call",
        handler: () => window.open(`tel:${phone.replace(/\s/g, "")}`, "_blank"),
      },
    };
  }

  // Default to text
  return {
    type: "text",
    value: content,
  };
}

export function getContentIcon(type: RecognizedContentType) {
  switch (type) {
    case "url":
      return "🔗";
    case "email":
      return "📧";
    case "phone":
      return "📞";
    default:
      return "📝";
  }
}
