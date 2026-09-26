/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { UserDashboard } from './features/users';

export default function App() {
  return (
    <Provider store={store}>
      <UserDashboard />
    </Provider>
  );
}
