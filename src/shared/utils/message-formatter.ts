export function formatMessage(
  message: string,
  ...args: (string | number)[]
): string {
  return message.replace(/{(\d+)}/g, (match, index: number) => {
    return typeof args[index] !== 'undefined' ? String(args[index]) : match;
  });
}
