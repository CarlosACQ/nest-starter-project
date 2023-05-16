export interface IPermission {
  slug: string;
  resource?: string;
  action?: string;
  description: string;
  isActive: boolean;
}