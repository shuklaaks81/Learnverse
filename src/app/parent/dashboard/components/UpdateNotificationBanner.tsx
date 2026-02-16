/**
 * UpdateNotificationBanner Component
 * 
 * Displays app update information with:
 * - Current and latest version numbers
 * - Release date
 * - Changelog viewing option
 * - Install now button
 * - Automatic update info
 */

interface UpdateNotificationBannerProps {
  latestVersion: string;
  currentVersion: string;
  updateInfo: any;
  showChangelog: boolean;
  onToggleChangelog: () => void;
  onInstall: () => void;
}

export function UpdateNotificationBanner({
  latestVersion,
  currentVersion,
  updateInfo,
  showChangelog,
  onToggleChangelog,
  onInstall,
}: UpdateNotificationBannerProps) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl p-6 mb-6 border-4 border-white/50">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
              🎉 New Update Available!
            </h2>
            <p className="text-white/90 mt-2 font-semibold">
              Version {latestVersion} • Released {updateInfo?.releaseDate}
            </p>
            <p className="text-white/80 mt-1 text-sm italic">
              Some updates may have been downloaded automatically if the app was stopped or restarted.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onToggleChangelog}
              className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-bold hover:scale-105 border-2 border-white/40"
            >
              📋 {showChangelog ? 'Hide' : 'View'} Changes
            </button>
            <button
              onClick={onInstall}
              className="bg-white text-green-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg hover:scale-105"
            >
              ⬇️ Install Now
            </button>
          </div>
        </div>
        {/* Changelog inside banner */}
        {showChangelog && updateInfo?.changelog && (
          <div className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-6 border-2 border-white/20">
            <h3 className="text-xl font-bold mb-4">📝 What&apos;s New in {latestVersion}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(updateInfo.changelog).map(([category, items]: [string, any]) => (
                <div key={category} className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-lg mb-2">{category}</h4>
                  <ul className="space-y-1">
                    {items.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-white/90">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
