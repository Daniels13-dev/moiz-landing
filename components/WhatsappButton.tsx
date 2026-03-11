export default function WhatsappButton() {

  const phone = "56912345678";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg"
    >
      WhatsApp
    </a>
  );
}