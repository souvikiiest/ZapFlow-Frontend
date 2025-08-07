

export default function WebhookTrigger({ onZapInit, webhookUrl, isPolling, pollingError, triggerMetadata, startPolling, isEditMode }) {
  return (
    <div className="flex gap-x-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">2</div>
      <div className="flex-1 space-y-4 pt-1">
        <h3 className="text-lg font-semibold text-slate-700">Test Your Trigger</h3>
        
        {!webhookUrl && !isEditMode && (
          <button
            onClick={onZapInit}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Get Webhook URL
          </button>
        )}

        {webhookUrl && (
          <>
            <p className="text-sm text-slate-500">Send a sample request to this URL from your application to connect it.</p>
            <div className="flex gap-2">
              <input type="text" readOnly value={webhookUrl} className="w-full bg-slate-100 border-slate-300 rounded-lg p-3 font-mono text-sm" />
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(webhookUrl);
                  e.target.innerHTML = "COPIED!";
                  setTimeout(() => e.target.innerHTML = "COPY", 2000);
                }}
                className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition shrink-0"
              >
                Copy
              </button>
            </div>

            {isEditMode && (
              <button
                onClick={startPolling}
                disabled={isPolling}
                className="mt-2 px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-200 disabled:bg-slate-400"
              >
                {isPolling ? 'Checking for New Data...' : 'Re-test Trigger'}
              </button>
            )}

            {isPolling && <p className="text-indigo-600 mt-2 animate-pulse font-medium">Waiting for data...</p>}
            {pollingError && <p className="text-red-500 mt-2 font-medium">{pollingError}</p>}
            {triggerMetadata && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Success! Trigger data received.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}