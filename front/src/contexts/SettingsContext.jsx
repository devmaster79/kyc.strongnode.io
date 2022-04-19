import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const initialState = {
  themeMode: 'dark',
  onChangeMode: () => {}
};

const SettingsContext = createContext(initialState);

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: 'dark'
  });

  const onChangeMode = (mode) => {
    setSettings({
      ...settings,
      themeMode: mode
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onChangeMode
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };
