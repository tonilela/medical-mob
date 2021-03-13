import React, { createContext, FunctionComponent, useState, useEffect } from 'react';

const AppContext = React.createContext({
  setUser: (user) => {
    return
  },
  user: undefined
})

const AppContextProvider = ({children}) => {
  const [test, setTestState] = useState('this is test state');
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // auth page i
  }, []);

  const logOut = () => {
    // setUser(undefined)

  }

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContextProvider, AppContext }