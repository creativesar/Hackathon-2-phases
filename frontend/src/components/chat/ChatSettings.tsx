import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  SwatchIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

interface ThemeSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  fontSize: 'small' | 'normal' | 'large';
  showAvatars: boolean;
}

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onSave: (settings: ThemeSettings) => void;
}

export default function ChatSettings({
  isOpen,
  onClose,
  settings,
  onSave
}: ChatSettingsProps) {
  const t = useTranslations("HomePage");
  const [localSettings, setLocalSettings] = useState<ThemeSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        </div>

        <div
          className="inline-block align-bottom bg-white/[0.03] backdrop-blur-xl rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Cog6ToothIcon className="h-6 w-6 text-violet-400" />
                {t("chat.settings")}
              </h3>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <SwatchIcon className="h-5 w-5 text-violet-400" />
                  {t("chat.theme")}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalSettings({...localSettings, theme: 'light'})}
                    className={`p-3 rounded-lg border transition-all ${
                      localSettings.theme === 'light'
                        ? 'bg-white/[0.08] border-violet-500 text-white'
                        : 'bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    <SunIcon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{t("chat.light")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalSettings({...localSettings, theme: 'dark'})}
                    className={`p-3 rounded-lg border transition-all ${
                      localSettings.theme === 'dark'
                        ? 'bg-white/[0.08] border-violet-500 text-white'
                        : 'bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    <MoonIcon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{t("chat.dark")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalSettings({...localSettings, theme: 'system'})}
                    className={`p-3 rounded-lg border transition-all ${
                      localSettings.theme === 'system'
                        ? 'bg-white/[0.08] border-violet-500 text-white'
                        : 'bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    <ComputerDesktopIcon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{t("chat.system")}</span>
                  </button>
                </div>
              </div>

              {/* Layout Preferences */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <ArrowsPointingOutIcon className="h-5 w-5 text-violet-400" />
                  {t("chat.layout")}
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer">
                    <span className="text-white/80">{t("chat.compactMode")}</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={localSettings.compactMode}
                        onChange={(e) => setLocalSettings({...localSettings, compactMode: e.target.checked})}
                        className="sr-only"
                      />
                      <div
                        className={`block h-6 w-10 rounded-full transition-colors ${
                          localSettings.compactMode ? 'bg-violet-500' : 'bg-white/10'
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                          localSettings.compactMode ? 'transform translate-x-4' : ''
                        }`}
                      ></div>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">{t("chat.fontSize")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'normal', 'large'] as const).map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setLocalSettings({...localSettings, fontSize: size})}
                          className={`p-2 rounded-lg border text-xs transition-all ${
                            localSettings.fontSize === size
                              ? 'bg-white/[0.08] border-violet-500 text-white'
                              : 'bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.06]'
                          }`}
                        >
                          {t(`chat.${size}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Preferences */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">{t("chat.avatars")}</h4>
                <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04] border border-white/10 cursor-pointer">
                  <span className="text-white/80">{t("chat.showAvatars")}</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={localSettings.showAvatars}
                      onChange={(e) => setLocalSettings({...localSettings, showAvatars: e.target.checked})}
                      className="sr-only"
                    />
                    <div
                      className={`block h-6 w-10 rounded-full transition-colors ${
                        localSettings.showAvatars ? 'bg-violet-500' : 'bg-white/10'
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                        localSettings.showAvatars ? 'transform translate-x-4' : ''
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/[0.04] text-white hover:bg-white/[0.06] border border-white/10 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}