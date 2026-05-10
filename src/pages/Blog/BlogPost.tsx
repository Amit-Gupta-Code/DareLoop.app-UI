import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { getBlog, type BlogPostDetail } from "@/src/services/blogService";
import { SEOHead } from "@/src/seo/SEOHead";

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getBlog(slug)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-40 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">
        Loading...
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-[800px] mx-auto pt-28 pb-20 px-4 text-center space-y-6">
        <h1 className="text-3xl font-black text-text-main">Post not found</h1>
        <Link to="/blog" className="btn-viral inline-flex">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt ?? `Read "${post.title}" on the Loopify Blog.`}
        canonical={`/blog/${post.slug}`}
      />
      <div className="max-w-[800px] mx-auto pt-24 pb-20 px-4 md:px-8 lg:px-12 animate-in fade-in duration-500">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {post.image && (
          <div className="rounded-[24px] overflow-hidden mb-10 h-64 md:h-80">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-4 mb-10">
          <span className="badge-green">Blog · Growth Insights</span>
          <h1 className="text-3xl lg:text-[44px] font-black tracking-tight leading-tight text-primary">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-text-muted text-[15px] leading-relaxed font-medium">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at ?? post.created_at)}
          </div>
        </div>

        <div
          className="card-main p-8 text-text-muted leading-relaxed
            [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-primary [&_h1]:mb-4 [&_h1]:mt-6
            [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-primary [&_h2]:mb-3 [&_h2]:mt-6
            [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-text-main [&_h3]:mb-2 [&_h3]:mt-4
            [&_p]:mb-4 [&_p]:text-[14px] [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
            [&_li]:text-[14px]
            [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
            [&_strong]:font-black [&_strong]:text-text-main
            [&_em]:italic
            [&_blockquote]:border-l-4 [&_blockquote]:border-accent/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-muted [&_blockquote]:my-4
            [&_img]:rounded-xl [&_img]:my-6 [&_img]:w-full
            [&_hr]:border-border-sleek [&_hr]:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
};

export default BlogPost;
