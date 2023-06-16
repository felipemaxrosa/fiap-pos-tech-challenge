export class EnvUtils {
  static envs(): string {
    const envs = Object.entries(process.env)
      .map((key, value) => `${key}=${value}`)
      .join('\n');

    return envs;
  }
}
