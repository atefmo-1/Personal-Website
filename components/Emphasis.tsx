// Renders *words between asterisks* in the italic serif accent, so copy in lib/ can mark the
// one or two words a sentence leans on.
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className="font-serif text-[1.08em] font-normal italic tracking-normal">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

// The same text with the markers removed, for places that need a plain string.
export const plain = (text: string) => text.replace(/\*/g, "");
