"use client";
import { EditorContent, EditorRoot, EditorInstance } from "novel";
import { useState, useEffect } from "react";
import { defaultExtension } from "./extensions";
import { EditorMenu } from "./editor-menu";
import { TextButtons } from "./selectors/text-button";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "../ui/separator";
import { useDebouncedCallback } from "use-debounce";

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

const extensions = [...defaultExtension];

export const InputEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [openNode, setOpenNode] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const [content, setContent] = useState<string>(value || "");

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const newContent = editor.getHTML();
      setContent(newContent);
      onChange(newContent);
    },
    500
  );

  // Sync initial value when it changes
  useEffect(() => {
    setContent(value);
  }, [value]);

  return (
    <div className="w-full relative">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          extensions={extensions}
          initialContent={
            value
              ? {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: value }],
                    },
                  ],
                }
              : defaultEditorContent
          }
          editorProps={{
            attributes: {
              class:
                "prose prose-headings:font-title font-default focus:outline-none w-full px-2.5 py-1.5 rounded-md border border-input bg-background shadow-sm focus:ring-1 focus:ring-blue-400 transition-all",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
        >
          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};
