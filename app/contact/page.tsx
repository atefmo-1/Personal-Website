import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = { title: "Say hello" };

export default function ContactPage() {
  return <Contact />;
}
