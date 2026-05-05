import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateChallenge = () => {
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/explore");
      }, 1200);
    };
  
    return (
      <div className="pt-24 pb-20 px-6 max-w-[600px] mx-auto animate-in zoom-in-95 duration-500">
        <motion.div className="card-main space-y-8 shadow-2xl border-accent/10">
          <div className="text-center space-y-2">
            <span className="badge-green">Loop Initiation ⚡</span>
            <h2 className="text-3xl font-black">Spawn Growth Loop</h2>
            <p className="text-text-muted text-[15px]">The algorithm ko ignore karo. Start your own reach engine.</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="stat-label block cursor-default">Loop Name</label>
              <input 
                required
                className="w-full px-5 py-4 rounded-xl border border-border-sleek bg-surface focus:bg-card-bg focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all font-medium text-[15px]"
                placeholder={`e.g. POV: "Don't let this flop" — tag 3 creators chain`}
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="stat-label block cursor-default">Growth Mission</label>
              <textarea 
                required
                rows={4}
                className="w-full px-5 py-4 rounded-xl border border-border-sleek bg-surface focus:bg-card-bg focus:outline-none focus:ring-4 focus:ring-accent/5 transition-all font-medium text-[15px] resize-none"
                placeholder="Creators stitch your hook, drop the loop link in bio + Stories, and tag 2 people who HAVE to keep it going in 48h. First join gets pinned — mid content not invited, we're chasing FYP energy only."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-viral w-full py-5 text-lg shadow-xl"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" /> : "Deploy Viral Loop"} <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  };
  export default CreateChallenge;