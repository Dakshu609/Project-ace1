import Link from "next/link";
import { Globe, Mail, Share2, Zap } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";

const footerLinks = {
  Platform: [
    { href: "/freelancers", label: "Browse Freelancers" },
    { href: "/services", label: "Browse Services" },
    { href: "/post-job", label: "Post a Job" },
    { href: "/auth", label: "Sign Up" },
  ],
  Company: [
    { href: "#", label: "About Us" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Press" },
  ],
  Support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Trust & Safety" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              Project Ace
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The premier marketplace for hiring top coding talent. Connect with
              verified developers, designers, and engineers worldwide.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Social">
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Website">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-semibold">Newsletter</h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Get hiring tips and top freelancer picks.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input placeholder="Email address" type="email" className="flex-1" />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Project Ace. All rights reserved.</p>
          <p>Contact: hello@projectace.com</p>
        </div>
      </div>
    </footer>
  );
}
