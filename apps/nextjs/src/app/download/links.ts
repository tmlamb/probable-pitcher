import { env } from "~/env";

export const iosAppStoreUrl = `https://apps.apple.com/us/app/probable-pitcher/${env.NEXT_PUBLIC_IOS_APP_STORE_ID}`;
export const androidPlayStoreUrl = `https://play.google.com/store/apps/details?id=${env.NEXT_PUBLIC_ANDROID_PACKAGE_NAME}`;
