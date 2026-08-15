export const validatePhone = (phone) => /^09\d{9}$/.test(phone.replace(/\s/g, ""));
export const validateText = (text, min = 3) => text.trim().length >= min;
