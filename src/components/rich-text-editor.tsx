"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/api";

function Btn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "h-8 w-8 inline-grid place-items-center rounded-lg text-sm transition",
        active ? "bg-[rgba(255,106,0,.14)] text-[var(--brand-700)]" : "hover:bg-black/5 text-[#334155]"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[var(--brand-700)] underline" } }),
      Placeholder.configure({ placeholder: placeholder || "Escreva o conteúdo do artigo..." }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "prose-editor-content focus:outline-none" },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL da imagem:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="border-b border-[var(--line)] bg-[#fafbfc] p-2 flex flex-wrap gap-0.5">
        <Btn title="Desfazer" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </Btn>
        <Btn title="Refazer" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </Btn>
        <span className="mx-1 w-px bg-[var(--line)] self-stretch" />
        <Btn active={editor.isActive("bold")} title="Negrito" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </Btn>
        <Btn active={editor.isActive("italic")} title="Itálico" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </Btn>
        <Btn active={editor.isActive("underline")} title="Sublinhado" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </Btn>
        <Btn active={editor.isActive("strike")} title="Riscado" onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </Btn>
        <Btn active={editor.isActive("highlight")} title="Destaque" onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}>
          <Highlighter size={16} />
        </Btn>
        <span className="mx-1 w-px bg-[var(--line)] self-stretch" />
        <Btn active={editor.isActive("paragraph")} title="Parágrafo" onClick={() => editor.chain().focus().setParagraph().run()}>
          <Pilcrow size={16} />
        </Btn>
        <Btn active={editor.isActive("heading", { level: 2 })} title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </Btn>
        <Btn active={editor.isActive("heading", { level: 3 })} title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </Btn>
        <Btn active={editor.isActive("bulletList")} title="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </Btn>
        <Btn active={editor.isActive("orderedList")} title="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </Btn>
        <Btn active={editor.isActive("blockquote")} title="Citação" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </Btn>
        <Btn title="Linha" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </Btn>
        <span className="mx-1 w-px bg-[var(--line)] self-stretch" />
        <Btn title="Esquerda" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={16} />
        </Btn>
        <Btn title="Centro" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={16} />
        </Btn>
        <Btn title="Direita" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={16} />
        </Btn>
        <span className="mx-1 w-px bg-[var(--line)] self-stretch" />
        <Btn active={editor.isActive("link")} title="Link" onClick={addLink}>
          <LinkIcon size={16} />
        </Btn>
        <Btn title="Imagem" onClick={addImage}>
          <ImageIcon size={16} />
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
