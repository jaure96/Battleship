export interface ToastDef {
  message: string;
  type: ToastType;
  duration: number;
  id: number;
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
