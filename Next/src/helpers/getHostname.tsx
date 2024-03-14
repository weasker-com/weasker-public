export function getHostname(link: string): string {
  const url = new URL(link);
  return url.hostname;
}
