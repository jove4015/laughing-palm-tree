import { useSession } from "@clerk/nextjs";
import * as React from "react";
import { trpc } from "~/utils/trpc";
import jwt_decode from "jwt-decode";
import { kiefaCustomJWTTemplate } from "./types";
/*
  Any global application context can be maintained here.
*/

export interface IAppContext {
  facilities?: number[];
  loadingFacilities: boolean;
  selectedFacilities?: number[];
  setSelectedFacilities: (facilities: number[]) => void;
  loadingUoms: boolean;
  refreshFacilities: () => Promise<void>;
}

const AppContext = React.createContext<IAppContext>({
  facilities: [],
  loadingFacilities: true,
  selectedFacilities: [],
  setSelectedFacilities: () => {},
  loadingUoms: true,
  refreshFacilities: async () => {},
});

export interface ContextProviderProps {
  children: React.ReactNode;
}

export function ContextProvider(props: ContextProviderProps) {
  const { session, isSignedIn } = useSession();

  const [_, setLastOrg] = React.useState("");

  const ensureUser = trpc.user.ensureUser.useQuery(undefined, {
    enabled: !!isSignedIn,
    onSuccess: (data) => {
      if (data !== null) {
        if (data == 0) return;
        if (data == 1) {
          if (session) {
            session
              .getToken({
                skipCache: true,
              })
              .then((token) => {
                if (token) {
                  const jwt = jwt_decode<kiefaCustomJWTTemplate>(token);
                  if (jwt?.facilities) {
                    setState((prevState) => ({
                      ...prevState,
                      facilities: jwt.facilities,
                      selectedFacilities: jwt.facilities,
                      loadingFacilities: false,
                    }));
                  }
                }
              });
          }
        }
      }
    },
  });

  const [state, setState] = React.useState<
    Omit<
      IAppContext,
      "setDefaultUoms" | "refreshFacilities" | "setSelectedFacilities"
    >
  >({
    facilities: [],
    selectedFacilities: [],
    loadingFacilities: true,
    loadingUoms: true,
  });

  const refreshFacilities = React.useCallback(async () => {
    await ensureUser.refetch();
  }, [ensureUser]);

  const setSelectedFacilities = React.useCallback(
    (selectedFacilities: number[]) => {
      setState((prevState) => ({
        ...prevState,
        selectedFacilities,
      }));
      if (window && window.localStorage) {
        window.localStorage.setItem(
          "selectedFacilities",
          JSON.stringify(Array.from(selectedFacilities.entries()))
        );
      }
    },
    [setState]
  );

  const contextValue = {
    ...state,
    setSelectedFacilities,
    refreshFacilities,
  };

  React.useEffect(() => {
    setLastOrg((lastOrg) => {
      if (window && window.localStorage) {
        const selectedFacilities =
          window.localStorage.getItem("selectedFacilities");
        if (selectedFacilities) {
          const facilities: number[] = JSON.parse(selectedFacilities);
          setState((prevState) => ({
            ...prevState,
            selectedFacilities: facilities,
          }));
        }
      }

      // if the current organization changes without a page refresh somehow, we should refresh the facilities
      if (
        session &&
        session.lastActiveOrganizationId &&
        (lastOrg != session.lastActiveOrganizationId ||
          state.loadingFacilities) &&
        session.lastActiveToken
      ) {
        const jwt = session.lastActiveToken.jwt?.claims as
          | kiefaCustomJWTTemplate
          | undefined;
        if (jwt?.facilities) {
          setState((prevState) => ({
            ...prevState,
            facilities: jwt.facilities,
            selectedFacilities: jwt.facilities,
            loadingFacilities: false,
          }));
          return session.lastActiveOrganizationId;
        }
      }
      return lastOrg;
    });
  }, [
    setState,
    session,
    state.loadingFacilities,
    state.loadingUoms,
    setLastOrg,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return React.useContext(AppContext);
}
