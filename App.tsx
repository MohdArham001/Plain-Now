import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { Landing } from "./views/Landing";
import { DocumentInput } from "./views/DocumentInput";
import { Results } from "./views/Results";
import { HowItWorks } from "./views/HowItWorks";
import { Auth } from "./views/Auth";
import {
  ViewState,
  AnalysisResult,
  DocumentInputState,
} from "./types";
import { analyzeDocument } from "./services/geminiService";
import { supabase } from "./services/supabase";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.LANDING
  );
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔐 AUTH BOOTSTRAP (FIXED)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    if (!user) {
      setCurrentView(ViewState.AUTH);
      return;
    }
    setCurrentView(ViewState.INPUT);
  };

  const handleDocumentSubmit = async (
    input: DocumentInputState
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeDocument(
        input.text,
        input.fileBase64,
        input.file?.type ?? null,
        input.style
      );

      setAnalysisResult(result);
      setCurrentView(ViewState.RESULTS);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return (
          <Landing
            onStart={handleStart}
            onHowItWorks={() =>
              setCurrentView(ViewState.HOW_IT_WORKS)
            }
          />
        );

      case ViewState.HOW_IT_WORKS:
        return <HowItWorks onStart={handleStart} />;

      case ViewState.AUTH:
        return <Auth />;

      case ViewState.INPUT:
        if (!user) return <Auth />;
        return (
          <DocumentInput
            isLoading={isLoading}
            onSubmit={handleDocumentSubmit}
            error={error}
          />
        );

      case ViewState.RESULTS:
        return analysisResult ? (
          <Results
            result={analysisResult}
            onReset={() => setCurrentView(ViewState.INPUT)}
          />
        ) : null;

      default:
        return null;
    }
  };

  if (checkingAuth) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
