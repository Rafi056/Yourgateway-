import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useInstitutions } from "@/hooks/use-institutions";
import { Building2, MapPin, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Institutions() {
  const [location] = useLocation();
  // Extract simple query param manually for simplicity
  const searchParams = new URLSearchParams(window.location.search);
  const initialType = searchParams.get("type") || "all";
  
  const [filterType, setFilterType] = useState<string>(initialType);
  
  const { data: institutions, isLoading, error } = useInstitutions(
    filterType === "all" ? undefined : filterType
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Discover Institutions
          </h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Browse our curated selection of top-tier educational institutions across Malaysia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-border pb-4">
          <button
            onClick={() => setFilterType("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterType === "all" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            All Institutions
          </button>
          <button
            onClick={() => setFilterType("university")}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              filterType === "university" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" /> Universities
          </button>
          <button
            onClick={() => setFilterType("language_center")}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
              filterType === "language_center" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Language Centers
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p>Loading institutions...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-xl text-center">
            <p className="font-bold">Failed to load institutions.</p>
            <p className="text-sm opacity-80">Please try again later.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {institutions?.map((inst, idx) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-muted relative overflow-hidden">
                  {inst.imageUrl ? (
                    <img 
                      src={inst.imageUrl} 
                      alt={inst.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                      {inst.type === 'university' ? <Building2 className="w-12 h-12 opacity-50" /> : <BookOpen className="w-12 h-12 opacity-50" />}
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                      inst.type === 'university' ? 'bg-primary/90 text-white' : 'bg-secondary/90 text-secondary-foreground'
                    }`}>
                      {inst.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold mb-2 line-clamp-2">{inst.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {inst.location}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                    {inst.description}
                  </p>
                  
                  <Link href={`/institutions/${inst.id}`}>
                    <Button className="w-full group/btn" variant="outline">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {institutions?.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No institutions found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
