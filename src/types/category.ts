export type CategoryListType = {
  id: number;
  title: string;
  date: string;
  text: string;
};

export type CategoryGroupType = {
  id: number;
  categoryName: string;
  check: boolean;
  list: CategoryListType[];
};
