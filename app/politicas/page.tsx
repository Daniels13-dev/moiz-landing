import LegalLayout from "@/components/LegalLayout";
import { politicasData } from "@/data/legal";

export const metadata = {
  title: "Políticas de Envío y Reembolso | Möiz",
  description: "Conoce nuestras políticas de envío, devoluciones y reembolsos.",
};

export default function PoliticasPage() {
  return (
    <LegalLayout
      title={
        <>
          Políticas de{" "}
          <span className="text-[var(--moiz-green)]">Envío y Reembolso</span>
        </>
      }
    >
      {politicasData.sections.map((section, idx) => (
        <div key={idx} className={idx > 0 ? "mt-12" : "mt-8"}>
          <h2 className="text-2xl font-bold text-[var(--moiz-dark)] mb-4">
            {section.subtitle}
          </h2>

          {section.content &&
            section.content.map((paragraph, pIdx) => (
              <p key={pIdx} className="mb-4">
                {paragraph}
              </p>
            ))}

          {section.list && (
            <ul className="list-disc pl-6 space-y-2 mb-4">
              {section.list.map((item, lIdx) => (
                <li key={lIdx}>{item}</li>
              ))}
            </ul>
          )}

          {section.orderedList && (
            <ol className="list-decimal pl-6 space-y-4 mb-4">
              {section.orderedList.map((item, oIdx) => {
                const parts = item.split(": ");
                if (parts.length > 1) {
                  return (
                    <li key={oIdx}>
                      <strong className="text-[var(--moiz-dark)]">
                        {parts[0]}:
                      </strong>{" "}
                      {parts.slice(1).join(": ")}
                    </li>
                  );
                }
                return <li key={oIdx}>{item}</li>;
              })}
            </ol>
          )}
        </div>
      ))}

      {politicasData.footerNote && (
        <p className="mt-8 italic font-semibold text-[var(--moiz-green)]">
          {politicasData.footerNote}
        </p>
      )}
    </LegalLayout>
  );
}
