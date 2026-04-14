import LegalLayout from "@/components/LegalLayout";
import { terminosData } from "@/data/legal";

export const metadata = {
  title: "Términos y Condiciones | Möiz",
  description: "Términos y condiciones de uso del sitio web y servicios de Möiz.",
};

export default function TerminosPage() {
  return (
    <LegalLayout
      title={
        <>
          Términos y <span className="text-[var(--moiz-green)]">Condiciones</span>
        </>
      }
    >
      {terminosData.intro && <p>{terminosData.intro}</p>}

      {terminosData.sections.map((section, idx) => (
        <div key={idx} className="mt-8">
          <h2 className="text-2xl font-bold text-[var(--moiz-dark)] mb-4">{section.subtitle}</h2>

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

          {/* Rendering for ordered lists if any */}
          {section.orderedList && (
            <ol className="list-decimal pl-6 space-y-4 mb-4">
              {section.orderedList.map((item, oIdx) => (
                <li key={oIdx}>
                  <strong className="text-[var(--moiz-dark)]">{item.split(":")[0]}:</strong>
                  {item.split(":").slice(1).join(":")}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}

      {terminosData.footerNote && (
        <p className="mt-12 text-sm text-gray-500 italic">{terminosData.footerNote}</p>
      )}
    </LegalLayout>
  );
}
