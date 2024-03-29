import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { encrypt, decrypt } from 'utils/crypto';

const initialState = {
  userNo: null,
  userId: null,
  token: null,
  isLoggedIn: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setupSession: (state) => {
      const encryptedToken = sessionStorage.getItem('info') || '';
      const encryptedName = sessionStorage.getItem('name') || '';
      if (encryptedToken) {
        // get session info
        const jwtToken = decrypt(
          process.env.REACT_APP_SESSION_KEY || '',
          encryptedToken,
        );
        const name = decrypt(
          process.env.REACT_APP_SESSION_KEY || '',
          encryptedName,
        );
        const decodedJwtToken = jwtDecode(jwtToken);
        // setup session state
        Object.assign(state, {
          userNo: decodedJwtToken.userInfo.userNo,
          userId: name,
          token: encryptedToken,
          isLoggedIn: true,
        });
      } else {
        Object.assign(state, { ...state, isLoggedIn: false });
      }
    },
    startSession: (state, action) => {
      try {
        const [userId, jwtToken] = action.payload;
        const decodedJwtToken = jwtDecode(jwtToken);
        // save session after encription
        const encryptedToken = encrypt(
          process.env.REACT_APP_SESSION_KEY || '',
          jwtToken,
        );
        sessionStorage.setItem('info', encryptedToken);
        sessionStorage.setItem(
          'name',
          encrypt(process.env.REACT_APP_SESSION_KEY || '', userId),
        );
        // setup session state
        return Object.assign(state, {
          userNo: decodedJwtToken.userInfo.userNo,
          userId: userId,
          token: encryptedToken,
          isLoggedIn: true,
        });
      } catch (e) {
        console.log('catch');
        return state;
      }
    },
    endSession: (state) => {
      sessionStorage.removeItem('info');
      Object.assign(state, { ...initialState, isLoggedIn: false });
    },
  },
});

export const { setupSession, startSession, endSession } = sessionSlice.actions;

export const selectSession = (state) => state.session;
export const selectIsLoggedIn = (state) => state.session.isLoggedIn;
export const selectUserNo = (state) => state.session.userNo;

export default sessionSlice.reducer;
