import { useApplications } from "@/hooks/use-applications";
import { useInstitutions } from "@/hooks/use-institutions";
import { Loader2, FileText, Calendar, Building, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function Dashboard() {
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: institutions, isLoading: instLoading } = useInstitutions();

  const isLoading = appsLoading || instLoading;

  // Helper to map institution ID to name
  const getInstitutionName = (id: number) => {
    return institutions?.find(i => i.id === id)?.name || `مؤسسة رقم ${id}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'قيد الانتظار';
      case 'approved': return 'تمت الموافقة';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 text-right">
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            لوحة التحكم الخاصة بي
          </h1>
          <p className="text-background/80 max-w-2xl text-lg">
            تابع حالة طلبات التقديم الخاصة بك للجامعات ومعاهد اللغة.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p>جاري تحميل طلباتك...</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-muted/20 flex-row-reverse">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2 flex-row-reverse">
                <FileText className="w-6 h-6 text-primary" />
                الطلبات المقدمة
              </h2>
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">
                {applications?.length || 0} إجمالي
              </span>
            </div>

            {applications && applications.length > 0 ? (
              <div className="divide-y divide-border">
                {applications.map((app) => (
                  <div key={app.id} className="p-6 md:p-8 hover:bg-muted/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 flex-row-reverse">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <h3 className="text-xl font-bold text-foreground">
                          {app.desiredProgram}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide flex items-center gap-1 flex-row-reverse ${getStatusColor(app.status)}`}>
                          {app.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {getStatusLabel(app.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground flex-row-reverse">
                        <div className="flex items-center gap-2 flex-row-reverse">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{getInstitutionName(app.institutionId)}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-row-reverse">
                          <Calendar className="w-4 h-4" />
                          قدم في {app.createdAt ? format(new Date(app.createdAt), 'd MMMM yyyy', { locale: ar }) : 'غير معروف'}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-foreground">المقدم:</span> {app.studentName} ({app.studentEmail})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center px-4">
                <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">لا توجد طلبات حتى الآن</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  لم تقم بتقديم أي طلبات بعد. تصفح مؤسساتنا وابدأ رحلتك اليوم.
                </p>
                <Link href="/institutions">
                  <Button className="rounded-full px-8 py-6 text-lg font-bold">تصفح المؤسسات</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
