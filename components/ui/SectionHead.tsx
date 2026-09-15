// Shared section eyebrow + title + optional lead text.

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  text?: string;
  titleId?: string;
  textId?: string;
  centered?: boolean;
  contact?: boolean;
}

export function SectionHead({
  eyebrow,
  title,
  text,
  titleId,
  textId,
  centered,
  contact,
}: SectionHeadProps) {
  return (
    <div
      className={`section__head${centered ? ' section__head--center' : ''}${contact ? ' section__head--contact' : ''}`}
    >
      <div>
        <div className="section__eyebrow">{eyebrow}</div>
        <h2 className="section__title" id={titleId}>
          {title}
        </h2>
      </div>
      {text ? (
        <p className="section__text" id={textId}>
          {text}
        </p>
      ) : null}
    </div>
  );
}
