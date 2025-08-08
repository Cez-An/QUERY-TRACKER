export function generateQueryNumber() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `Q-${timestamp}-${randomNum}`;
}
