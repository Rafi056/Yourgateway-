import { useState } from "react";
import { useParams } from "wouter";
import { useInstitution } from "@/hooks/use-institutions";
import { useCreateApplication } from "@/hooks/use-applications";
import { MapPin, CheckCircle, Loader2, ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function InstitutionDetails() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: institution, isLoading, error } = useInstitution(id);
  const { mutate: submitApplication, isPending } = useCreateApplication();
  
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    desiredProgram: "",
    documents: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution) return;

    submitApplication({
      ...formData,
      institutionId: institution.id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Institution not found</h2>
        <Link href="/institutions" className="text-primary hover:underline">
          Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Hero Banner for Institution */}
      <div className="relative h-[40vh] min-h-[300px] bg-primary">
        {institution.imageUrl && (
          <img 
            src={institution.imageUrl} 
            alt={institution.name}
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Link href="/institutions" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to institutions
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                institution.type === 'university' ? 'bg-primary/90 text-white border border-primary-foreground/20' : 'bg-secondary text-secondary-foreground'
              }`}>
                {institution.type.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4">
              {institution.name}
            </h1>
            <div className="flex items-center text-foreground/80 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {institution.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-6 border-b pb-4">About the Institution</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="leading-relaxed whitespace-pre-line">
                  {institution.description}
                </p>
              </div>
            </section>

            <section className="bg-card p-8 rounded-2xl border shadow-sm">
              <h3 className="font-serif text-2xl font-bold mb-6">Why Choose Us?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "World-class facilities",
                  "Expert faculty members",
                  "Global student community",
                  "Comprehensive support services",
                  "Strategic location",
                  "Industry connections"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Application Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-3xl p-8 border border-border shadow-xl">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold">Start Your Application</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Take the first step towards your future at {institution.name}. Fill out the form below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Full Name</Label>
                  <Input 
                    id="studentName"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formData.studentName}
                    onChange={e => setFormData({...formData, studentName: e.target.value})}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentEmail">Email Address</Label>
                  <Input 
                    id="studentEmail"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.studentEmail}
                    onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredProgram">Desired Program</Label>
                  <Input 
                    id="desiredProgram"
                    required
                    placeholder={institution.type === 'university' ? "e.g. BSc Computer Science" : "e.g. Intensive English Course"}
                    value={formData.desiredProgram}
                    onChange={e => setFormData({...formData, desiredProgram: e.target.value})}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents (Links/Text)</Label>
                  <Textarea 
                    id="documents"
                    placeholder="Provide Google Drive link to your passport, transcripts, etc. or describe them here."
                    value={formData.documents}
                    onChange={e => setFormData({...formData, documents: e.target.value})}
                    className="min-h-[100px] bg-background"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg rounded-xl mt-4" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <>Processing <Loader2 className="ml-2 w-5 h-5 animate-spin" /></>
                  ) : (
                    <>Submit Application <Send className="ml-2 w-5 h-5" /></>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting, you agree to our terms and privacy policy.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
