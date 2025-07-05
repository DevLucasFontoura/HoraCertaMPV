import { Outlet } from 'react-router-dom';
import Footer from '../Footer/footer';

const Layout = () => {
  return (
    <div className="app">
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout; 