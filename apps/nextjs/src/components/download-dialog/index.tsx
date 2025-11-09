"use client";

import Image from "next/image";
import QRCode from "react-qr-code";

import { cn } from "@probable/ui";
import { Button, buttonVariants } from "@probable/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@probable/ui/dialog";

import { androidPlayStoreUrl, iosAppStoreUrl } from "~/app/download/links";
import AppleDownloadBlackIcon from "./apple-download-black-icon";
import GoogleDownloadBlack from "./google_download_black.png";

const downloadUrl = "/download";

function QRCodeLink() {
  const host = typeof window !== "undefined" && window.location.host;

  return (
    <div className="mx-auto">
      <div
        className={cn(
          "border-border text-foreground flex flex-col items-center justify-center gap-6 rounded-lg border bg-white py-8 shadow-lg",
          "max-w-[min(90vw,350px)]",
        )}
      >
        <QRCode
          value={`https://${host || "probablepitcher.com"}${downloadUrl}`}
          size={160}
          bgColor="transparent"
          fgColor="#000000"
          className="rounded"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 pt-4 sm:flex-row sm:gap-4">
        <AppleDownloadLink />
        <AndroidDownloadLink />
      </div>
    </div>
  );
}

function AppleDownloadLink() {
  return (
    <Button
      asChild
      variant="link"
      size="lg"
      className="mx-auto my-3 p-3 text-lg font-semibold"
    >
      <a href={iosAppStoreUrl} target="_blank" rel="noreferrer">
        <AppleDownloadBlackIcon />
      </a>
    </Button>
  );
}

function AndroidDownloadLink() {
  return (
    <Button
      asChild
      variant="link"
      size="lg"
      className="mx-auto my-3 p-3 text-lg font-semibold"
    >
      <a href={androidPlayStoreUrl} target="_blank" rel="noreferrer">
        <Image
          className="flex flex-col justify-center"
          height={40}
          src={GoogleDownloadBlack}
          alt="Get it on Google Play"
          placeholder="blur"
        ></Image>
      </a>
    </Button>
  );
}

function DownloadMethod() {
  const userAgent = typeof window !== "undefined" && window.navigator.userAgent;

  const isIOS = userAgent && /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = userAgent && /Android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;
  if (!isMobile) {
    return <QRCodeLink />;
  } else if (isIOS) {
    return <AppleDownloadLink />;
  } else if (isAndroid) {
    return <AndroidDownloadLink />;
  }
}

export default function DownloadDialog() {
  // If not on mobile show a QR code to the /download page
  return (
    <Dialog modal={true}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: "primary",
            size: "lg",
            className: "mx-1.5 cursor-pointer p-3 text-lg",
          }),
        )}
      >
        Get the Mobile App
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Probable Pitcher</DialogTitle>
          <DialogDescription>
            Scan the QR code with your mobile device to download the app, or use
            one of the buttons to visit your phone's app store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DownloadMethod />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// }
