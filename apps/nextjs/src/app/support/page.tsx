import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@probable/ui/button";
import { faqs } from "@probable/ui/utils";

export default function Support() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-start space-y-4 px-3 py-8 sm:px-8">
      <h1 className="text-3xl leading-normal font-extrabold text-gray-700 sm:text-5xl">
        Support
      </h1>
      <div className="flex max-w-prose flex-col space-y-4">
        <p>
          Thank you for using Probable Pitcher! This service is developed as an
          open source project on the GitHub platform. If you have any questions
          or need help, please reach out over GitHub:
        </p>
        <Button asChild>
          <a href="https://github.com/tmlamb/probable-pitchers/issues/new">
            <GitHubLogoIcon
              className="mr-2 inline h-6 w-6"
              aria-hidden="true"
            />
            Report Issue On Github
          </a>
        </Button>
        <h2 className="pt-4 text-2xl">FAQs</h2>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="pt-2 font-bold">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
        <h2 className="pt-4 text-2xl">Contact Us</h2>
        <p>
          The fastest way to receive support is to open an issue on the GitHub
          page linked above. Emails are also welcome:
          <span className="block pt-2 text-sm">
            contact@probablepitcher.com
          </span>
        </p>
      </div>
    </main>
  );
}
