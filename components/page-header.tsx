type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow ? <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#F28B6E]">{eyebrow}</p> : null}
      <h1 className="font-serif text-4xl font-black tracking-[-0.04em] text-[#3A2D52] sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#6B5B8A]">{description}</p>
    </header>
  );
}
