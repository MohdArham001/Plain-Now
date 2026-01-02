import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

interface ResultsProps {
  result: any;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const explanation = result?.meaning || "No explanation could be generated.";
  const riskLevel = result?.riskLevel || "MEDIUM";
  const riskReason = result?.riskReason || "This is an AI-generated interpretation. Review carefully.";
  const actions = result?.actions || [];

  const copySummary = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskStyles = (level: string) => {
    switch (level) {
      case "LOW":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-800",
          icon: <CheckCircle2 className="text-emerald-600" size={24} />,
          label: "Low Risk",
        };
      case "HIGH":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-800",
          icon: <AlertOctagon className="text-rose-600" size={24} />,
          label: "High Risk",
        };
      default:
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: <AlertTriangle className="text-amber-600" size={24} />,
          label: "Medium Risk",
        };
    }
  };

  const riskStyle = getRiskStyles(riskLevel);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Analyze another document
      </button>

      {/* Risk Header */}
      <div
        className={`p-6 rounded-2xl border ${riskStyle.bg} ${riskStyle.border} flex gap-4`}
      >
        {riskStyle.icon}
        <div>
          <h3 className={`font-bold text-lg ${riskStyle.text}`}>
            {riskStyle.label}
          </h3>
          <p className={`text-sm ${riskStyle.text} opacity-90`}>
            {riskReason}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Explanation */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 border shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">What This Means</h2>
            <button onClick={copySummary}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-brand-50 rounded-2xl p-8 border">
          <h2 className="text-xl font-bold mb-6">What You Should Do</h2>
          <ul className="space-y-4">
            {actions.map((action, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-bold">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-brand-600 hover:bg-brand-50"
        >
          <RefreshCw size={18} /> Analyze Another
        </button>
      </div>
    </div>
  );
};
