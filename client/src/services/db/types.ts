export interface MenuItem {
  id: number;
  name: string;
  price: number | string;
}

export interface MenuData {
  menu: {
    [category: string]: MenuItem[];
  };
}
