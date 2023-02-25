export interface IPermission {
  id: number;
  slug: string;
  resource?: string;
  action?: string;
  description: string;
  isActive: boolean;
}