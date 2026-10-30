import { type FC, useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Wifi, 
  WifiOff 
} from 'lucide-react';
import { clearGeminiKey, saveGeminiKey, testGeminiConnection } from '../services/api';
import type { AiStatusResponse } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiStatus: AiStatusResponse | null;
  onStatusUpdated: (newStatus: AiStatusResponse) => void;
}

export const ApiKeyModal: FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  aiStatus,
  onStatusUpdated,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Synchronize editing state whenever modal opens or aiStatus changes
  useEffect(() => {
    if (isOpen) {
      setIsEditing(!aiStatus?.isConfigured);
      setApiKey('');
      setFeedback(null);
    }
  }, [isOpen, aiStatus?.isConfigured]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await saveGeminiKey(apiKey.trim());
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: res.message || 'Gemini API key successfully verified and securely persisted!' 
        });
        setApiKey('');
        setIsEditing(false);
        onStatusUpdated({
          success: true,
          isConfigured: true,
          status: 'connected',
          mode: 'LIVE_AI',
          isSaved: true,
          model: aiStatus?.model || 'gemini-3.8-flash',
          maskedKey: '••••••••',
          message: 'Connected to live Google Gemini AI'
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to verify API key' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Network error saving API key' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      const res = await testGeminiConnection();
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Connection verified: Google Gemini API is live and responsive!' 
        });
      } else if (res.status === 'network_error') {
        setFeedback({ 
          type: 'info', 
          message: 'Network timeout reached during ping. Your saved key remains securely preserved.' 
        });
      } else {
        setFeedback({ 
          type: 'error', 
          message: res.error || res.message || 'Connection check failed. Please check or update your key.' 
        });
      }
    } catch (err: any) {
      setFeedback({ 
        type: 'info', 
        message: 'Could not contact backend test endpoint. Your saved configuration is preserved.' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to remove the saved Gemini API key and switch to Demo Mode?')) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      await clearGeminiKey();
      setFeedback({ type: 'success', message: 'API Key removed. Switched to local Demo Mode.' });
      setIsEditing(true);
      onStatusUpdated({
        success: true,
        isConfigured: false,
        status: 'disconnected',
        mode: 'DEMO_MODE',
        isSaved: false,
        model: aiStatus?.model || 'gemini-3.8-flash',
        maskedKey: null,
        message: 'Running in local verified Demo Mode'
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error clearing key' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 text-sky-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">AI Engine Configuration</h2>
            <p className="text-xs text-slate-400">Google Gemini Live Generative AI & Evaluator</p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3.5 rounded-xl mb-4 text-xs flex items-start gap-2.5 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : feedback.type === 'info'
              ? 'bg-sky-950/60 border-sky-500/40 text-sky-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            ) : feedback.type === 'info' ? (
              <Wifi className="w-4 h-4 mt-0.5 shrink-0 text-sky-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
            )}
            <span className="leading-relaxed">{feedback.message}</span>
          </div>
        )}

        {/* SAVED & VERIFIED CONFIGURATION VIEW */}
        {aiStatus?.isConfigured && !isEditing ? (
          <div className="space-y-4">
            {/* Status Grid */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Gemini API:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Mode:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide bg-sky-500/15 text-sky-300 border border-sky-400/30">
                  <Cpu className="w-3.5 h-3.5" />
                  LIVE AI MODE
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Configuration:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Active Key:</span>
                <span className="font-mono text-sm tracking-widest text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {aiStatus.maskedKey || '••••••••'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Engine Model:</span>
                <span className="text-xs font-mono text-slate-300">{aiStatus.model || 'gemini-3.8-flash'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || isLoading}
                className="flex-1 py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-sky-400' : ''}`} />
                {isTesting ? 'Testing Link...' : 'Test Connection'}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isTesting || isLoading}
                className="flex-1 py-2.5 px-3.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 rounded-xl text-xs font-semibold transition-all border border-sky-400/30 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Update / Replace Key
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isTesting || isLoading}
                className="py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-medium transition-all border border-rose-500/30 flex items-center justify-center gap-1.5"
                title="Switch to Demo Mode"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* KEY INPUT / UPDATE FORM */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                {aiStatus?.isConfigured ? 'Update Your Gemini API Key' : 'Enter Gemini API Key to Enable Live AI'}
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Your key is securely persisted on the backend and remembered automatically across browser reloads and server restarts.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Gemini API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-600 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                Need a free key? Get one in seconds from{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating & Persisting...
                  </>
                ) : (
                  'Verify & Save Key'
                )}
              </button>

              {aiStatus?.isConfigured && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFeedback(null);
                  }}
                  disabled={isLoading}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Security & Deployment Footnote */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1">
          <div className="flex items-center gap-1 text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Backend Secure Persistence
          </div>
          <p className="text-slate-400">
            Never stored in browser storage (localStorage, cookies, or frontend state). Safely persisted in server database and environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};

