export function checkRateLimit(req: Request) {
  return {
    limited: false,
    retryAfter: 60
  };
}
