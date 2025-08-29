import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer flex flex-col justify-around bg-base-200 text-base-content p-10 mt-16 md:flex-row">
      <div>
        <span className="footer-title text-green-600">Minha Árvore</span>
        <p className="max-w-xs text-sm">
          Conectando pessoas e empresas ao ato de plantar árvores, ajudando a
          restaurar ecossistemas e criar um futuro mais verde 🌱.
        </p>
      </div>

      <div>
        <span className="footer-title">Links</span>
        <Link href="/" className="link link-hover">
          Início
        </Link>
        <Link href="/catalogo" className="link link-hover">
          Catálogo
        </Link>
        <Link href="/sobre" className="link link-hover">
          Sobre Nós
        </Link>
        <Link href="/contato" className="link link-hover">
          Contato
        </Link>
      </div>

      <div>
        <span className="footer-title">Redes Sociais</span>
        <a
          href="https://facebook.com"
          target="_blank"
          className="link link-hover"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          className="link link-hover"
        >
          Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          className="link link-hover"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
