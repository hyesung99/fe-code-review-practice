const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRequest<T>(handler: () => T, { failRate = 0 } = {}): Promise<T> {
  await delay(300 + Math.random() * 700);

  if (Math.random() < failRate) {
    throw new Error('일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
  }

  return structuredClone(handler());
}
