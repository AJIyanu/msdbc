type MenuItem = {
  menu: string;
  link: string;
  icon: string;
  isActive?: boolean;
};

type MenuGroup = {
  groupName: string;
  menuItems: MenuItem[];
};

type MenuConfig = MenuGroup[];
