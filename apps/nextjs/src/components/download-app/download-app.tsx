import { headers } from "next/headers";
import QRCode from "react-qr-code";

import { cn } from "@probable/ui";
import { Button } from "@probable/ui/button";

const downloadUrl = "/download";

async function DownloadMethod() {
  const headersList = await headers();

  const userAgent = headersList.get("user-agent");

  const isIOS = userAgent && /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = userAgent && /android/i.test(userAgent);
  const isMobile = isIOS ?? isAndroid;
  if (!isMobile) {
    return (
      <>
        <p className="text-muted-foreground text-center text-sm">
          Scan the QR code with your mobile device to download the app.
        </p>
        <QRCode
          value={`${headersList.get("x-forwarded-proto") ?? "https"}://${
            headersList.get("host") ?? "probablepitcher.com"
          }${downloadUrl}`}
          size={160}
          bgColor="transparent"
          fgColor="#000000"
          className="rounded"
        />
      </>
    );
  } else if (isIOS) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = downloadUrl;
        }}
      >
        Download on the App Store
      </Button>
    );
  } else if (isAndroid) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          window.location.href = downloadUrl;
        }}
      >
        Get it on Google Play
      </Button>
    );
  }
}

export default function DownloadDialog() {
  // If not on mobile show a QR code to the /download page
  return (
    <div
      className={cn(
        "border-border bg-popover flex flex-col items-center justify-center gap-6 rounded-lg border p-6 shadow-lg",
        "w-[min(90vw,400px)]",
      )}
    >
      <h3 className="text-center text-lg font-medium leading-none tracking-tight">
        Download Probable Pitcher
      </h3>
      <DownloadMethod />
    </div>
  );
}
// }
