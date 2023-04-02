export const streamToString = async (stream: any) => {
  const chunks: any[] = [];
  return await new Promise((resolve, reject) => {
    stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err: any) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};
