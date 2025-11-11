declare module "*.png" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const value: import("next/image").StaticImageData;
  export default value;
}
