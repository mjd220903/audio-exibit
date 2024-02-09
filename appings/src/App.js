import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Pages/Home'
import Second from './Pages/Second';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

const router=createBrowserRouter([
  {path:'/',element:<Home/>},
  {path:'/second',element:<Second/>}
  ]);


function App() {
      return (
        <React.StrictMode>
        <RouterProvider router={router} />
        </React.StrictMode>
      );
    };

export default App;
