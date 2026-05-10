import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { getBlogs, type BlogPost } from "@/src/services/blogService";
import { SEOHead } from "@/src/seo/SEOHead";

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogIndex = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEOHead
        title="Blog — Growth Insights & Creator Stories"
        description="Deep dives into viral growth, recursive distribution, and what it really takes to build a chain that multiplies."
        canonical="/blog"
      />
      <div className="max-w-[1240px] mx-auto pt-28 pb-20 px-4 md:px-8 lg:px-12 space-y-16 animate-in fade-in duration-500">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="badge-green">Blog · Growth Insights</span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-primary">
            The Loopify Blog
          </h1>
          <p className="text-text-muted text-base leading-relaxed font-medium">
            Deep dives into viral growth, recursive distribution, and what it really takes to build a chain that multiplies.
          </p>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-20 text-text-muted animate-pulse font-black uppercase tracking-[0.2em]">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-[32px] border-2 border-dashed border-border-sleek">
            <BookOpen className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-text-muted">No posts yet</h3>
            <p className="text-sm text-text-muted/60 mt-2">Check back soon — content is on its way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="card-main overflow-hidden group hover:border-accent flex flex-col h-full"
                >
                  {post.image ? (
                    <div className="h-48 overflow-hidden bg-surface">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-accent/5 flex items-center justify-center border-b border-border-sleek">
                      <BookOpen className="w-10 h-10 text-accent/30" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at ?? post.created_at)}
                    </div>
                    <h2 className="text-lg font-black text-text-main leading-snug group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-text-muted font-medium leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-accent text-[11px] font-black uppercase tracking-widest pt-2">
                      Read more <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogIndex;
