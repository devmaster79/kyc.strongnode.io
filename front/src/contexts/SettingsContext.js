import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const initialState = {
  themeMode: 'light',
  onChangeMode: () => {},
};

const SettingsContext = createContext(initialState);

function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: 'light',
  });

  const onChangeMode = (event) => {
    setSettings({
      ...settings,
      themeMode: event.target.value
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onChangeMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };
