import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import DevTools from './containers/DevTools';

// app specific imports
import Root from './containers/Root';
import configureStore from './store/configureStore';
import rootSaga from './sagas';

const store = configureStore();
store.runSaga(rootSaga);

render(
  <Provider store={store}>
    <div>
      <Root />
      {process.env.NODE_ENV === 'development' && (
        <DevTools />
      )}
    </div>
  </Provider>,
  document.getElementById('main'),
);
