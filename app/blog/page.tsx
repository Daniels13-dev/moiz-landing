import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 pt-12 md:pt-20 px-6 max-w-7xl mx-auto w-full pb-24">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] font-black text-xs uppercase tracking-widest mb-6">
            <BookOpen size={14} />
            Universo Möiz
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-6">
            Blog & <span className="text-[var(--moiz-green)]">Bienestar</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
            Consejos de expertos, ciencia del cuidado felino y nuestra misión por un planeta más verde.
          </p>
        </div>

        {/* Featured Post (Highlighted) */}
        {blogPosts.length > 0 && (
          <div className="relative group mb-12 md:mb-20 overflow-hidden rounded-[3rem] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50">
            <Link href={`/blog/${blogPosts[0].slug}`} className="absolute inset-0 z-10" />
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-[300px] lg:h-[500px] overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                    <Clock size={14} /> {blogPosts[0].readTime} de lectura
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-6 leading-tight group-hover:text-[var(--moiz-green)] transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-zinc-500 text-lg mb-8 font-medium leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-2 font-bold text-[var(--moiz-green)]">
                  Leer artículo <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, idx) => (
            <div
              key={post.slug}
              className="group bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  <Calendar size={12} /> {new Date(post.date).toLocaleDateString("es-ES", { month: "long", day: "numeric" })}
                </div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight group-hover:text-[var(--moiz-green)] transition-all mb-4 leading-tight">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-auto flex items-center gap-2 font-bold text-sm text-[var(--moiz-green)]"
                >
                  Continuar leyendo <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
