"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail } from "lucide-react";

// FAQ type
type FAQ = {
  question: string;
  answer: string;
};

export default function HelpSupportPage(){
  const [faqs] = useState<FAQ[]>([
    {
      question: "How do I register a new NFC card?",
      answer:
        "Go to NFC Devices section → Enter Card UID → Assign categories & limits → Save.",
    },
    {
      question: "Can I export my expenses?",
      answer:
        "Yes, go to Reports & Export → Choose CSV or PDF to download your report.",
    },
    {
      question: "How do I set budget limits?",
      answer:
        "Open Budget & Insights → Add limits per category → AI will alert you if exceeded.",
    },
  ]);

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-600 flex items-center gap-2">
        <HelpCircle className="h-7 w-7 text-yellow-600" />
        Help & Support
      </h1>

      {/* FAQs */}
      <Card className="mb-6 border-yellow-600 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-600">📖 User Guide / FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {faqs.map((faq, i) => (
              <li key={i} className="border rounded-lg p-4 border-yellow-600">
                <button
                  className="w-full text-left font-semibold text-yellow-700 flex justify-between items-center"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {faq.question}
                  <span>{expanded === i ? "−" : "+"}</span>
                </button>
                {expanded === i && (
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="border-yellow-600 shadow-md">
        <CardHeader className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-yellow-600">📩 Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              className="border-yellow-600"
            />
            <Input
              type="email"
              placeholder="Your Email"
              className="border-yellow-600"
            />
            <Textarea
              placeholder="Describe your issue..."
              className="border-yellow-600"
            />
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
