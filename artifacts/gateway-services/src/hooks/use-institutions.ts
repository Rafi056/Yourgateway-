import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useInstitutions(type?: 'university' | 'language_center' | string) {
  // We serialize the input to pass as query params if needed
  const searchParams = type ? new URLSearchParams({ type }).toString() : '';
  const url = type ? `${api.institutions.list.path}?${searchParams}` : api.institutions.list.path;

  return useQuery({
    queryKey: [api.institutions.list.path, type],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch institutions");
      return api.institutions.list.responses[200].parse(await res.json());
    },
  });
}

export function useInstitution(id: number | null) {
  return useQuery({
    queryKey: [api.institutions.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.institutions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch institution");
      
      return api.institutions.get.responses[200].parse(await res.json());
    },
    enabled: id !== null,
  });
}
