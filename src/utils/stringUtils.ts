function containsChinese(input: string) {
  if (/.*[\u4e00-\u9fa5]+.*$/.test(input)) {
    return true;
  } else {
    return false;
  }
}

function getFirstnameLastname(input: string) {
  const parts = input.split(" ");
  const length = parts.length;
  if (length === 0) {
    return input;
  } else if (length >= 1 && length < 2) {
    return parts[0];
  } else {
    return parts[0] + " " + parts[-1];
  }
}

function genAvatarText(input: string) {
  if (containsChinese(input)) {
    return input.charAt(0);
  } else {
    return getFirstnameLastname(input);
  }
}

export { genAvatarText };
