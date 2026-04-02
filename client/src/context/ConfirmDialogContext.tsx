import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ConfirmDialogContextType {
  options: ConfirmDialogOptions | null;
  isLoading: boolean;
  open: (options: ConfirmDialogOptions) => void;
  close: () => void;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

type ConfirmDialogState = {
  options: ConfirmDialogOptions | null;
  isLoading: boolean;
};

type ConfirmDialogAction =
  | { type: "OPEN"; options: ConfirmDialogOptions }
  | { type: "CLOSE" }
  | { type: "SET_LOADING"; isLoading: boolean };

const initialState: ConfirmDialogState = {
  options: null,
  isLoading: false,
};

const reducer = (
  state: ConfirmDialogState,
  action: ConfirmDialogAction
): ConfirmDialogState => {
  switch (action.type) {
    case "OPEN":
      return { ...state, options: action.options };
    case "CLOSE":
      return { options: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(
  null
);

export const ConfirmDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const open = useCallback((newOptions: ConfirmDialogOptions) => {
    dispatch({ type: "OPEN", options: newOptions });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const handleConfirm = async () => {
    dispatch({ type: "SET_LOADING", isLoading: true });
    try {
      await state.options?.onConfirm?.();
      close();
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  const handleCancel = () => {
    state.options?.onCancel?.();
    close();
  };

  const value: ConfirmDialogContextType = {
    options: state.options,
    isLoading: state.isLoading,
    open,
    close,
    handleConfirm,
    handleCancel,
  };

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context)
    throw new Error("useConfirmDialog 必須在 ConfirmDialogProvider 內被使用！");
  return { open: context.open };
};

export const useConfirmDialogContext = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context)
    throw new Error(
      "useConfirmDialogContext 必須在 ConfirmDialogProvider 內被使用！"
    );
  return context;
};
