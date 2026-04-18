import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type CameraMenuContextValue = {
  /** Вызывается из экрана «Камеры» при фокусе — открывает выезжающее меню */
  openMenu: () => void;
  registerOpenMenu: (fn: (() => void) | null) => void;
};

const CameraMenuContext = createContext<CameraMenuContextValue | null>(null);

export function CameraMenuProvider({ children }: { children: ReactNode }) {
  const openerRef = useRef<(() => void) | null>(null);

  const registerOpenMenu = useCallback((fn: (() => void) | null) => {
    openerRef.current = fn;
  }, []);

  const openMenu = useCallback(() => {
    openerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({ openMenu, registerOpenMenu }),
    [openMenu, registerOpenMenu]
  );

  return (
    <CameraMenuContext.Provider value={value}>{children}</CameraMenuContext.Provider>
  );
}

export function useCameraMenu() {
  const ctx = useContext(CameraMenuContext);
  if (!ctx) {
    throw new Error("useCameraMenu must be used within CameraMenuProvider");
  }
  return ctx;
}
