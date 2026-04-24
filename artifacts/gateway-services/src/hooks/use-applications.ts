import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useApplications() {
  return useQuery({
    queryKey: [api.applications.list.path],
    queryFn: async () => {
      const res = await fetch(api.applications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.list.responses[200].parse(await res.json());
    },
  });
}

export function useApplication(id: number | null) {
  return useQuery({
    queryKey: [api.applications.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.applications.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch application");
      
      return api.applications.get.responses[200].parse(await res.json());
    },
    enabled: id !== null,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertApplication) => {
      const validated = api.applications.create.input.parse(data);
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.applications.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create application");
      }

      return api.applications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.applications.list.path] });
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully received.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
