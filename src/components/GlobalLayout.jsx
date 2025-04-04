import PropTypes from 'prop-types';
import { useBackendCheck } from '../hooks/useBackendCheck';
import { Loading } from './Loading/Loading';
import { BackendError } from './BackendError';

export default function GlobalLayout({ children }) {
  const { available, loading } = useBackendCheck();
  console.log('GlobalLayout status:', { available, loading }); // Debug log

  if (loading) return <Loading message="Checking services..." />;
  if (!available) return <BackendError />;

  return <>{children}</>;
}

GlobalLayout.propTypes = {
  children: PropTypes.node.isRequired
}; 