import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import "./index.css"
import reportWebVitals from './reportWebVitals';
import { LoaderProvider } from './contexts/LoaderContext';
import Loader from './components/common/Loader';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <Loader />
        <Toaster position='top-right' toastOptions={{duration:1000}} />
        <App />
      </LoaderProvider>
    </Provider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
