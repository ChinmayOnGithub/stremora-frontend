import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from './UserDropdown';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';
import CompactDayNightToggle from '@/components/theme/CompactDayNightToggle.jsx';

const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');

  const paths = location.pathname.split('/').filter(Boolean);

  const performSearch = useCallback(debounce((value) => {
    if (value) {
      navigate(`/search?q=${value}`);
    }
  }, 300), [navigate]);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {paths.map((path, index) => (
              <React.Fragment key={path}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {index === paths.length - 1 ? (
                    <BreadcrumbPage>{capitalize(path.replace('-', ' '))}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={`/${paths.slice(0, index + 1).join('/')}`}>
                        {capitalize(path.replace('-', ' '))}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <form onSubmit={(e) => { e.preventDefault(); performSearch.flush(); }} className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            placeholder="Search... ( / )"
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <CompactDayNightToggle height={32} />

        {user ? (
          <UserDropdown onLogout={logout} />
        ) : (
          <Button size="sm" onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </header>
  );
}

export default React.memo(Header);
