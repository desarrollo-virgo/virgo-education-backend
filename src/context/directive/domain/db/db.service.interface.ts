export interface StoreServiceI {
  getAll: () => any;
  getById: () => any;
  save: (data: any) => void;
  update: (data: any, id: any) => void;
}
