import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { DocumentInput } from './views/DocumentInput';
import { Results } from './views/Results';
import { HowItWorks } from './views/HowItWorks';
import { ViewState, AnalysisResult, DocumentInputState } from './types';
import { analyzeDocument } from './services/geminiService';


type Todo = {
  id: number;
  title: string;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Supabase debug state
  const [supabaseStatus, setSupabaseStatus] = useState<string>("Checking Supabase…");

  // 🔹 SAFE Supabase test (no crash possible)
  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { supabase } = await import("./services/supabase");

        const { data, error } = await supabase
          .from("todos")
          .select("id")
          .limit(1);

        if (error) {
          setSupabaseStatus(`Supabase error: ${error.message}`);
        } else {
          setSupabaseStatus("Supabase connected ✅");
          console.log("Supabase data:", data);
        }
      } catch (err: any) {
        console.error("Supabase crash:", err);
        setSupabaseStatus("Supabase failed to initialize ❌ (check .env)");
      }
    };

    testSupabase();
  }, []);

  const handleStart = () => {
    setCurrentView(ViewState.INPUT);
    setAnalysisResult(null);
    setError(null);
  };

  const handleDocumentSubmit = async (input: DocumentInputState) => {
    setIsLoading(true);
    setError(null);
    try {
      let mimeType = null;
      if (input.file) {
        mimeType = input.file.type;
      }

      const result = await analyzeDocument(
        input.text,
        input.fileBase64,
        mimeType,
        input.style
      );

      setAnalysisResult(result);
      setCurrentView(ViewState.RESULTS);
    } catch (err: any) {
      console.error("Submit Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setAnalysisResult(null);
    setError(null);
    setCurrentView(ViewState.INPUT);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return <Landing onStart={handleStart} onHowItWorks={() => setCurrentView(ViewState.HOW_IT_WORKS)} />;
      case ViewState.HOW_IT_WORKS:
        return <HowItWorks onStart={handleStart} />;
      case ViewState.INPUT:
        return (
          <DocumentInput
            isLoading={isLoading}
            onSubmit={handleDocumentSubmit}
            error={error}
          />
        );
      case ViewState.RESULTS:
        return analysisResult ? (
          <Results result={analysisResult} onReset={resetFlow} />
        ) : (
          <div className="flex justify-center p-20">No result data found.</div>
        );
      default:
        return <Landing onStart={handleStart} onHowItWorks={() => setCurrentView(ViewState.HOW_IT_WORKS)} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
