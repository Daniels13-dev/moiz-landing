import LegalLayout from "@/components/LegalLayout";
import { privacidadData } from "@/data/legal";

export const metadata = {
  title: "Aviso de Privacidad | Möiz",
  description: "Aviso de Privacidad y manejo de datos personales de Möiz.",
};

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title={
        <>
          Aviso de <span className="text-[var(--moiz-green)]">Privacidad</span>
        </>
      }
    >
      {privacidadData.intro && (
        <p
          dangerouslySetInnerHTML={{
            __html: privacidadData.intro.replace("Möiz", "<strong>Möiz</strong>"),
          }}
        />
      )}

      {privacidadData.sections.map((section, idx) => (
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
              {section.list.map((item, lIdx) => {
                const parts = item.split(": ");
                if (parts.length > 1) {
                  return (
                    <li key={lIdx}>
                      <strong>{parts[0]}:</strong> {parts.slice(1).join(": ")}
                    </li>
                  );
                }
                return <li key={lIdx}>{item}</li>;
              })}
            </ul>
          )}
        </div>
      ))}
    </LegalLayout>
  );
}
