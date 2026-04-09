import { Metadata, ResolvingMetadata } from "next";
import { blogPosts } from "@/data/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { getFeaturedProduct } from "@/services/products";
import BlogProductCard from "@/components/BlogProductCard";
import Comparison from "@/components/Comparison";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug: slugParam } = await params;
  const post = blogPosts.find((p) => p.slug === slugParam);

  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: `${post.title} | Blog Möiz`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugParam } = await params;
  const post = blogPosts.find((p) => p.slug === slugParam);

  if (!post) notFound();

  // Refactor: Uso de arquitectura de servicios para datos limpios
  const featuredProduct = await getFeaturedProduct();

  // Helper to render bold text consistently across all elements
  const renderFormattedText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="text-zinc-900 font-black">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <article className="flex-1">
        {/* Luxury Hero Header */}
        <header className="relative h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-[1500ms] ease-out scale-100"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-zinc-900/50 to-zinc-900" />

          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-24 max-w-7xl mx-auto w-full">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 text-white/90 hover:text-[var(--moiz-green)] font-bold mb-12 transition-all group px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-fit"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Regresar al Universo Möiz
              </Link>
              
              <div className="flex flex-col gap-6 max-w-4xl">
                <span className="text-[var(--moiz-green)] font-black uppercase tracking-[0.3em] text-xs">
                  {post.category} • {post.readTime}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] drop-shadow-2xl font-playfair italic">
                  {post.title}
                </h1>
                <div className="h-1.5 w-32 bg-[var(--moiz-green)] rounded-full mt-4 shadow-lg shadow-[var(--moiz-green)]/20" />
              </div>
            </div>
          </div>
        </header>

        {/* Article Body with Luxury Container */}
        <div className="max-w-5xl mx-auto px-6 pb-32 -mt-10 relative z-20">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-zinc-200/50 p-8 md:p-20 border border-zinc-100/50">
            <div className="flex flex-col lg:flex-row gap-20">
              {/* Sidebar Info */}
              <aside className="lg:w-1/4 flex flex-col gap-12 border-b lg:border-b-0 lg:border-r border-zinc-100 pb-12 lg:pb-0">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Publicado</span>
                  <p className="font-bold text-zinc-900 flex items-center gap-2">
                    <Calendar size={14} className="text-[var(--moiz-green)]" />
                    {new Date(post.date).toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Autor</span>
                  <p className="font-bold text-zinc-900 italic font-playfair">Möiz Editorial Team</p>
                </div>
                <button className="flex items-center gap-3 text-sm font-black text-zinc-400 hover:text-[var(--moiz-green)] transition-all">
                  <Share2 size={18} /> Compartir Esencia
                </button>
              </aside>

              {/* Advanced Content Rendering */}
              <div className="flex-1 prose prose-zinc prose-lg lg:prose-xl max-w-none 
                prose-h1:font-playfair prose-h1:italic prose-h1:text-5xl prose-h1:tracking-tighter prose-h1:text-zinc-900 prose-h1:mb-12
                prose-h2:font-playfair prose-h2:text-4xl prose-h2:italic prose-h2:text-[var(--moiz-green)] prose-h2:mt-24 prose-h2:mb-8
                prose-p:text-zinc-500 prose-p:leading-[2] prose-p:text-lg md:prose-p:text-xl prose-p:mb-10 font-medium
                prose-blockquote:border-none prose-blockquote:bg-zinc-50 prose-blockquote:py-16 prose-blockquote:px-12 prose-blockquote:rounded-[3rem] prose-blockquote:italic prose-blockquote:text-zinc-800 prose-blockquote:font-playfair prose-blockquote:text-2xl prose-blockquote:relative prose-blockquote:my-20 prose-blockquote:text-center
                prose-strong:text-zinc-900 prose-strong:font-black">
                
                {post.content.trim().split("\n\n").map((para, i, allParas) => {
                  const elements = [];
                  
                  if (para.startsWith("# ")) {
                    elements.push(<h1 key={`${i}-h1`} className="text-center md:text-left">{renderFormattedText(para.replace("# ", ""))}</h1>);
                  } else if (para.startsWith("## ")) {
                    elements.push(<h2 key={`${i}-h2`}>{renderFormattedText(para.replace("## ", ""))}</h2>);
                  } else if (para.startsWith("### ")) {
                    elements.push(<h3 key={`${i}-h3`} className="font-playfair italic text-3xl font-bold mt-16 mb-8 text-zinc-800">{renderFormattedText(para.replace("### ", ""))}</h3>);
                  } else if (para.startsWith("> ")) {
                    elements.push(<blockquote key={`${i}-bq`}>{renderFormattedText(para.replace("> ", "").replace(/"/g, ""))}</blockquote>);
                  } else if (para.startsWith("1. ") || para.startsWith("* ")) {
                     elements.push(
                       <div key={`${i}-list`} className="my-16 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                         {para.split("\n").map((li, j) => (
                           <div key={j} className="group bg-[#FDFDFD] p-8 rounded-[2rem] border border-zinc-50 hover:border-[var(--moiz-green)]/20 transition-all hover:shadow-xl hover:shadow-zinc-100 flex flex-col gap-4">
                             <div className="w-10 h-10 rounded-full bg-[var(--moiz-green)]/5 text-[var(--moiz-green)] flex items-center justify-center font-black text-sm group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
                               0{j + 1}
                             </div>
                             <p className="m-0 text-zinc-600 font-bold leading-tight text-lg">
                               {renderFormattedText(li.replace(/^[0-9*.]\s+/, ""))}
                             </p>
                           </div>
                         ))}
                       </div>
                     );
                  } else {
                    const isFirstPara = i === 1 || (i === 0 && !post.content.trim().startsWith("#"));
                    elements.push(
                      <p 
                        key={`${i}-p`} 
                        className={isFirstPara ? "text-2xl md:text-3xl font-playfair italic text-zinc-900 leading-[1.6] first-letter:text-8xl first-letter:font-black first-letter:text-[var(--moiz-green)] first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] mb-12" : "mb-10"}
                      >
                        {renderFormattedText(para)}
                      </p>
                    );
                  }

                  if (i === 1 && featuredProduct) {
                    elements.push(<BlogProductCard key="inline-product" product={featuredProduct} />);
                  }

                  // Insert Comparison Component at the end of the specific comparison post
                  if (i === allParas.length - 1 && post.slug === "comparativa-bentonita-vs-maiz") {
                    elements.push(
                      <div key="comparison-block" className="mt-12">
                        <Comparison isBlog={true} />
                      </div>
                    );
                  }

                  return elements;
                })}
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
