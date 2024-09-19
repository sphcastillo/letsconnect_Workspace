"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useTransition, FormEvent } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese"
  | "italian"
  | "swahili"
  | "swedish";

const languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
  "italian",
  "swahili",
  "swedish",
];

export default function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const handleAskQuestion = async (e: FormEvent) => {
    console.log("clicked translate")
    e.preventDefault();

    startTransition(async () => {
      // get data from the document, in JSON format
      const documentData = doc.get("document-store").toJSON();
      // make request to CloudFlare backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetLanguage: language, documentData }),
        }
      )

      if(res.ok){
        const id = toast.loading("Translating...");
        const { translated_text } = await res.json();

        setSummary(translated_text);
        toast.success("Document has been translated successfully!", {
          id,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select a langauge and AI will translate a summary of the document in
            the selected language.
          </DialogDescription>

          <hr className="mt-5" />

          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>

            <div>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</div>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Select 
            value={language} 
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
