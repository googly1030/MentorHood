import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface UnauthenticatedRouteProps {
  children: React.ReactNode;
}

const UnauthenticatedRoute: React.FC<UnauthenticatedRouteProps> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UnauthenticatedRoute;