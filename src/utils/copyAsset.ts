import { Asset } from "expo-asset";
import { File } from "expo-file-system";

export async function copyAsset(
  module: number,
  dest: File,
  isCancelled: () => boolean = () => false,
): Promise<void> {
  if (dest.exists) return;

  const asset = Asset.fromModule(module);
  await asset.downloadAsync();

  let sourceUri = asset.localUri;
  if (!sourceUri || !sourceUri.startsWith("file://")) {
    asset.localUri = null;
    asset.downloaded = false;
    await asset.downloadAsync();
    sourceUri = asset.localUri;
  }

  if (isCancelled() || !sourceUri) return;

  if (!sourceUri.startsWith("file://")) {
    throw new Error(`Asset resolved to a non-file URI: ${sourceUri}`);
  }

  await new File(sourceUri).copy(dest);
}
