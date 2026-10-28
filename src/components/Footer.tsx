import { Link } from "@tanstack/react-router"

const footerLinks = [
  {
    title: "brand",
    links: [
      { label: "About us", route: "/about" },
    ]
  },
  {
    title: "collection",
    links: [
      { label: "Wigs", route: "/collections?productType=wigs" },
      { label: "Eyelashes", route: "/collections?productType=eyelashes" },
      // { label: "Cushions", route: "/about" },
      // { label: "Dresses", route: "/about" },
    ]
  },
  {
    title: "support",
    links: [
      { label: "FAQs", route: "/faqs" },
      { label: "Contact us", route: "/contact" },
    ]
  },
  {
    title: "policy",
    links: [
      { label: "Privacy policy", route: "/privacy-policy" },
      { label: "Terms & Conditions", route: "/terms" },
      { label: "Refund policy", route: "/refund-policy" },
    ]
  },
]

export default function Footer() {
  return (
    <footer className="w-full bg-near-black px-22.5 py-15 flex justify-between gap-x-42.5">
      <img src="/img/koyalashes-logo.svg" alt="brand logo" className="w-[26%]" />
      {/* gap-x-31.5 */}
      <div className="w-full flex justify-between">
        {footerLinks.map((footerLink) => (
          <div key={footerLink.title} className="space-y-3.25">
            <h2 className="font-dm-serif text-primary text-lg uppercase">{footerLink.title}</h2>
            <div className="flex flex-col gap-y-3.25">
              {footerLink.links.map((link) => (
                <Link key={link.label.toLowerCase()} to={link.route} className="text-off-white">{link.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}
