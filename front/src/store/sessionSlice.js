
import { createSlice } from '@reduxjs/toolkit';


import { encrypt, decrypt } from 'utils/crypto';

const initialState = {
  username: null,
  authority: null,
  token: null,
  isLoggedIn: false,
  timeout: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setupSession: (state) => {
      const savedInfo = localStorage.getItem('info');
      if (savedInfo) {
        // get session info
        const [username, authority, token, timeout] = decrypt(
          process.env.REACT_APP_SESSION_KEY || '',
          localStorage.getItem('info') || '',
        ).split('_->');
        // setup session state
        Object.assign(state, {
          username,
          authority,
          token,
          isLoggedIn: true,
          timeout,
        });
      } else {
        Object.assign(state, {...state, isLoggedIn: false});
      }
    },
    startSession: (state, action) => {
      const { username, authority, token } = action.payload;
      const timeout = new Date().getTime() + Number(process.env.REACT_APP_SESSION_LIMIT);
      // save session 
      const encryptedInfo = encrypt(
        process.env.REACT_APP_SESSION_KEY || '',
        `${username}_->${authority}_->${token}_->${timeout}`,
      );
      localStorage.setItem('info', encryptedInfo);
      // setup session state
      Object.assign(state, {
        username,
        authority,
        token,
        isLoggedIn: true,
        timeout,
      });
    },
    endSession: (state) => {
      localStorage.removeItem('info');
      Object.assign(state, { ...initialState, isLoggedIn: false });
    },
  },
});

export const { setupSession, startSession, endSession } = sessionSlice.actions;

export default sessionSlice.reducer;
