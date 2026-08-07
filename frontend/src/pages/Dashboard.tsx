import React, { useEffect, useState } from 'react';
import { createUrlApi, deleteUrlApi, getUrlsApi } from '../api/url.api';
import type { UrlItem } from '../types';
import { Link2, Copy, Check, Trash2, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import { URL_MESSAGES } from '../constants/messages.constants';

export const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [shortening, setShortening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUrls = async () => {
    try {
      const data = await getUrlsApi();
      setUrls(data);
    } catch {
      setError(URL_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      setError(URL_MESSAGES.URL_REQUIRED);
      return;
    }

    setError(null);
    setShortening(true);

    try {
      const newUrl = await createUrlApi({ originalUrl });
      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || URL_MESSAGES.SHORTEN_FAILED);
    } finally {
      setShortening(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteUrlApi(deletingId);
      setUrls(urls.filter((u) => u.id !== deletingId));
    } catch {
      setError(URL_MESSAGES.DELETE_FAILED);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (id: string, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-cyan-950/40 border border-slate-800/80 backdrop-blur-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>Shorten Long URLs</span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create clean, trackable short links instantly.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Links</span>
            <p className="text-2xl font-extrabold text-white">{urls.length}</p>
          </div>
        </div>

        {/* Shorten Form */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleShorten} noValidate className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-path"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={shortening}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-violet-600/25 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
            >
              {shortening ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Shorten URL</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* URLs List Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Your Shortened Links</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
              {urls.length}
            </span>
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading your links...</div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-400">
              <Link2 className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="font-medium text-slate-300">No links shortened yet</p>
              <p className="text-sm text-slate-500 mt-1">Paste a URL above to create your first short link!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urls.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 font-semibold hover:underline flex items-center space-x-1 text-base"
                    >
                      <span>{item.shortUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-xs text-slate-400 truncate max-w-md" title={item.originalUrl}>
                      {item.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-auto">
                    <button
                      onClick={() => handleCopy(item.id, item.shortUrl)}
                      className={`px-4 py-2 text-xs font-medium rounded-xl border flex items-center space-x-1.5 transition-all duration-200 ${
                        copiedId === item.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">{URL_MESSAGES.DELETE_CONFIRM_TITLE}</h3>
              <p className="text-slate-400 text-sm">
                {URL_MESSAGES.DELETE_CONFIRM_DESC}
              </p>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
