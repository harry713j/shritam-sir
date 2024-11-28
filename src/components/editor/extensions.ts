import {
  StarterKit,
  MarkdownExtension,
  Mathematics,
  Command,
  TextStyle,
  Placeholder,
} from "novel/extensions";

const placeholder = Placeholder;
const starterKit = StarterKit.configure({
  code: {
    HTMLAttributes: {
      class: "rounded-md bg-muted  px-1.5 py-1 font-mono font-medium",
      spellcheck: false,
    },
  },
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: "text-foreground rounded p-1 hover:bg-accent cursor-pointer",
  },
  katexOptions: {
    throwOnError: false,
  },
});

export const defaultExtension = [
  placeholder,
  starterKit,
  mathematics,
  MarkdownExtension,
  Command,
  TextStyle,
];
