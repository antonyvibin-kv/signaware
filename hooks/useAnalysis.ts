import { AnalysisRequest, apiService, UploadProgress } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UseAnalysisReturn {
  isLoading: boolean;
  uploadProgress: number;
  error: string | null;
  analysisId: string | null;
  submitAnalysis: (request: AnalysisRequest) => Promise<void>;
  clearError: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const router = useRouter();

  const handleProgress = useCallback((progress: UploadProgress) => {
    setUploadProgress(progress.percentage);
  }, []);

  const submitAnalysis = useCallback(
    async (request: AnalysisRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        const response = await apiService.analyzeDocument(
          request,
          handleProgress
        );

        setAnalysisId(response.id);

        // Store analysis result in localStorage for the results page
        localStorage.setItem(
          "analysisResult",
          JSON.stringify(response.analysis)
        );

        // If analysis is completed immediately, redirect to results
        if (response.status === "completed") {
          router.push(`/results?id=${response.id}`);
        } else if (response.status === "processing") {
          // For async processing, redirect to a processing page or results with status
          router.push(`/results?id=${response.id}&status=processing`);
        } else if (response.status === "failed") {
          setError(response.errorMessage || "Analysis failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
    [router, handleProgress]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    uploadProgress,
    error,
    analysisId,
    submitAnalysis,
    clearError,
  };
}
