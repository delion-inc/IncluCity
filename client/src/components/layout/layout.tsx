"use client";

import { useEffect, useState, createContext, useContext, memo, useMemo } from "react";
import { Search, MapPin, User, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/auth.context";
import { useSearchPlaces } from "@/lib/hooks/use-places";
import { PlaceSearchResult } from "@/lib/types/place.types";

import Sidebar from "./sidebar/sidebar";
import RouteDialog from "./route/route-dialog";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type SearchContextType = {
  inputValue: string;
  setInputValue: (value: string) => void;
  searchResults: PlaceSearchResult[];
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  isLoading: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchBlur: () => void;
  handleSearchFocus: () => void;
  handlePlaceClick: (place: PlaceSearchResult) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }

  return context;
}

type SidebarContextType = {
  isSidebarCollapsed: boolean;
  handleSidebarCollapsedChange: (collapsed: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }

  return context;
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const sidebarContextValue = useMemo(
    () => ({
      isSidebarCollapsed,
      handleSidebarCollapsedChange,
    }),
    [isSidebarCollapsed],
  );

  return <SidebarContext.Provider value={sidebarContextValue}>{children}</SidebarContext.Provider>;
}

function SearchProvider({ children }: { children: React.ReactNode }) {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchQuery = useDebounce(inputValue, 1000); // 1000ms = 1 second

  const { data: places, isLoading } = useSearchPlaces(searchQuery);

  useEffect(() => {
    if (places) {
      setSearchResults(places);
      setShowResults(true);
    }
  }, [places]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 3) {
      setShowResults(false);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handlePlaceClick = (place: PlaceSearchResult) => {
    setShowResults(false);

    const mapEvent = new CustomEvent("setMapView", {
      detail: {
        lat: place.lat,
        lon: place.lon,
        name: place.name,
        placeId: place.placeId,
      },
    });

    window.dispatchEvent(mapEvent);
  };

  const searchContextValue = useMemo(
    () => ({
      inputValue,
      setInputValue,
      searchResults,
      showResults,
      setShowResults,
      isLoading,
      handleSearchChange,
      handleSearchBlur,
      handleSearchFocus,
      handlePlaceClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue, searchResults, showResults, isLoading],
  );

  return <SearchContext.Provider value={searchContextValue}>{children}</SearchContext.Provider>;
}

const MemoizedLogo = memo(function Logo() {
  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200"
    >
      <span className="text-xl text-primary">IncluSity</span>
    </Link>
  );
});

const SearchComponent = memo(function SearchComponent() {
  const {
    inputValue,
    searchResults,
    showResults,
    isLoading,
    handleSearchChange,
    handleSearchBlur,
    handleSearchFocus,
    handlePlaceClick,
  } = useSearchContext();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <div className="relative">
        <Input
          className="pl-10 pr-4 py-2 h-12 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 rounded-xl"
          placeholder="Пошук за назвою, адресою..."
          value={inputValue}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          onFocus={handleSearchFocus}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />

        {isLoading && inputValue.length >= 3 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {showResults && searchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.map((place, idx) => (
              <button
                key={`${place.name}-${idx}`}
                className="w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer flex items-start"
                onClick={() => handlePlaceClick(place)}
              >
                <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 shrink-0" />
                <div>
                  <p className="font-medium">{place.name}</p>
                  {place.placeId ? (
                    <p className="text-xs text-green-600">Доступне місце</p>
                  ) : (
                    <p className="text-xs text-gray-500">Адреса</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults &&
          inputValue.length > 2 &&
          (!searchResults || searchResults.length === 0) &&
          !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 p-4 text-center text-gray-500">
              Нічого не знайдено
            </div>
          )}
      </div>
    </div>
  );
});

const NavButtons = memo(function NavButtons() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      <RouteDialog />

      {isAuthenticated ? (
        <Button
          variant="secondary"
          size="lg"
          className="rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-red-500 text-red-500 cursor-pointer"
          aria-label="Вийти"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
          <span>Вийти</span>
        </Button>
      ) : (
        <Link href="/login">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-primary text-primary"
            aria-label="Увійти"
          >
            <User className="h-5 w-5 mr-2" aria-hidden="true" />
            <span>Увійти</span>
          </Button>
        </Link>
      )}
    </div>
  );
});

const MemoizedSidebar = memo(function MemoizedSidebar() {
  const { handleSidebarCollapsedChange } = useSidebarContext();

  return <Sidebar onCollapsedChange={handleSidebarCollapsedChange} />;
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="fixed inset-0 overflow-hidden">
          <main className="absolute inset-0">{children}</main>

          <MemoizedLogo />
          <SearchComponent />
          <NavButtons />
          <MemoizedSidebar />
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
