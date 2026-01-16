/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
//import { Link, useNavigate } from "react-router-dom";

import api from "../lib/api";
import { Link } from "react-router-dom";

export default function GeneratePage() {
  const [issueKey, setIssueKey] = useState("");
  const [preflight, setPreflight] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<any | null>(null);

  async function analyze() {
    if (!issueKey.trim()) return;
    setAnalyzing(true);
    setPreflight(null);
    try {
      const res = await api.post("/generations/preflight", {
        issueKey: issueKey.trim(),
      });
      setPreflight(res.data);
    } catch (err: any) {
      setPreflight({ error: err?.response?.data?.error || "Analysis failed" });
    } finally {
      setAnalyzing(false);
    }
  }
  async function performGeneration() {
    if (!issueKey.trim()) return;

    setGenerating(true);
    try {
      const res = await api.post("/generations/testcases", {
        issueKey: issueKey.trim(),
      });
      setGenResult(res.data.data);
    } catch (err: any) {
      setGenResult({
        error: err?.response?.data?.error || "Generation failed",
      });
    } finally {
      setGenerating(false);
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Generate Test Cases
        </h1>
        <p className="mt-2 text-gray-600">
          Enter a JIRA issue key to analyze and generate comprehensive test
          cases
        </p>
      </div>
      {/* Input Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={issueKey}
            placeholder="Enter JIRA issue key (e.g., SDETPRO-123)"
            onChange={(e) => setIssueKey(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={analyze}
            disabled={analyzing || !issueKey.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
          <button
            onClick={performGeneration}
            disabled={generating || !issueKey.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
      {/* Preflight Results */}
      {preflight && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analysis Results
          </h2>
          {preflight.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {preflight.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-`y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Issue Key
                  </span>
                  <p className="text-lg font-semibold text-gray-900">
                    {preflight.issueKey}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Title
                  </span>
                  <p className="text-gray-900">{preflight.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    UI Story
                  </span>
                  <p
                    className={`font-semibold ${
                      preflight.isUiStory ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {preflight.isUiStory ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Attachments
                  </span>
                  <p className="text-gray-900">{preflight.attachments || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Estimated Tokens
                  </span>
                  <p className="text-gray-900">
                    {preflight.estimatedTokens || 0}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Estimated Cost
                  </span>
                  <p className="text-gray-900">
                    $
                    {typeof preflight.estimatedCost === "string"
                      ? preflight.estimatedCost
                      : (Number(preflight.estimatedCost) || 0).toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Generation Results */}
      {/* In the generation results section*/}
      {genResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Generation Complete
          </h2>
          {genResult.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {genResult.error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Issue Key
                  </span>
                  <p className="text-lg font-semibold text-gray-900">
                    {genResult.issueKey}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500">
                    Generation Time
                  </span>
                  <p className="text-lg font-semibold text-gray-900">
                    {typeof genResult.generationTimeSeconds === "string"
                      ? `${genResult.generationTimeSeconds}s`
                      : `${(
                          Number(genResult.generationTimeSeconds) || 0
                        ).toFixed(1)}s`}
                  </p>
                </div>
              </div>
              {genResult.markdown && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ✅ Test cases generated successfully!{" "}
                    <Link
                      to={`/view/${genResult.generationId}`}
                      className="font-semibold underline hover:text-green-900"
                    >
                      View Test Cases
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
