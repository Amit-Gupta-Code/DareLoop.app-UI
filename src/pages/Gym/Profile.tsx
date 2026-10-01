import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, ChevronRight, Users } from "lucide-react";
import { getGymProfile, GymPublicProfile } from "@/src/services/organizationService";
import { SEOHead } from "@/src/seo/SEOHead";
import { breadcrumbSchema } from "@/src/seo/schema";
import defaultBanner from "@/src/assets/images/facebook-banner-dareloop.png";

const GymProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState<GymPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getGymProfile(slug)
      .then(setProfile)
      .catch(() => {
        setProfile(null);
        setError("This gym is not available.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <SEOHead
        title={profile ? `${profile.name} | DareLoop` : "Gym profile"}
        description={
          profile?.description ||
          "Public gym profile on DareLoop — active challenges and community activity."
        }
        canonical={slug ? `/g/${slug}` : "/explore"}
        schema={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Explore", url: "/explore" },
          { name: profile?.name || "Gym", url: slug ? `/g/${slug}` : "/explore" },
        ])}
      />
      <div className="max-w-[1240px] mx-auto pt-24 pb-12 px-4 md:px-8 lg:px-12 flex flex-col gap-10 animate-in fade-in duration-600">
        {loading && <p className="text-text-muted font-semibold text-sm">Loading gym…</p>}
        {error && <p className="text-red-400 font-semibold text-sm">{error}</p>}

        {!loading && !error && profile && (
          <>
            <div className="card-sleek p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface border border-border-sleek shrink-0">
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                )}
              </div>
              <div className="space-y-3 min-w-0">
                <span className="badge-green">Gym on DareLoop</span>
                <h1 className="text-3xl lg:text-[40px] font-black tracking-tight leading-none text-primary">
                  {profile.name}
                </h1>
                <p className="text-text-muted text-[15px] max-w-2xl leading-relaxed font-medium">
                  {profile.description || "No description yet."}
                </p>
                <div className="flex flex-wrap gap-3 text-[12px] font-black uppercase tracking-widest text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {profile.community.participant_count.toLocaleString()} participants
                  </span>
                  <span>
                    {profile.community.public_challenge_count.toLocaleString()} public challenges
                  </span>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-black text-primary">Active public challenges</h2>
              {profile.active_public_challenges.length === 0 && (
                <p className="text-text-muted font-semibold text-sm">
                  No public challenges yet.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profile.active_public_challenges.map((loop) => (
                  <Link
                    key={loop.id}
                    to={`/c/${loop.root_code}`}
                    className="card-sleek p-0 overflow-hidden group"
                  >
                    <div className="h-36 bg-surface overflow-hidden">
                      <img
                        src={loop.banner_image || defaultBanner}
                        alt={loop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-black line-clamp-2 group-hover:text-accent">{loop.title}</h3>
                      <p className="text-text-muted text-[13px] line-clamp-3">{loop.description}</p>
                      <div className="pt-2 flex items-center justify-between text-[12px] font-black">
                        <span className="text-text-muted">{loop.participant_count} in the loop</span>
                        <span className="text-accent inline-flex items-center gap-1">
                          Join <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default GymProfile;
