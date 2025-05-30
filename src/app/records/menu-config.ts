export const baseMenu = [
  {
    groupName: "",
    menuItems: [
      {
        menu: "Dashboard",
        link: "/records",
        icon: "HomeIcon",
        isActive: false,
      },
    ],
  },
  {
    groupName: "Attendance",
    menuItems: [
      {
        menu: "Sunday Service",
        link: "/records/sundayattendance",
        icon: "calendar",
        isActive: false,
      },
      {
        menu: "Sunday School",
        link: "/records/sundayschatt",
        icon: "book",
        isActive: false,
      },
      {
        menu: "Midweek Service",
        link: "/records/midweek",
        icon: "clock",
        isActive: false,
      },
      {
        menu: "Special Events",
        link: "/records/special",
        icon: "star",
        isActive: false,
      },
      {
        menu: "Reports",
        link: "/records/attendance/reports",
        icon: "file-bar-chart",
        isActive: false,
      },
    ],
  },
  {
    groupName: "Financials",
    menuItems: [
      {
        menu: "Tithes",
        link: "/records/financials/tithes",
        icon: "hand-coins",
        isActive: false,
      },
      {
        menu: "Building Fund",
        link: "/records/developmentfund",
        icon: "piggy-bank",
        isActive: false,
      },
      {
        menu: "Sunday Offering",
        link: "/records/sundayoffering",
        icon: "wallet",
        isActive: false,
      },
      {
        menu: "Sunday School Offering",
        link: "/records/sundayschoffering",
        icon: "school",
        isActive: false,
      },
      {
        menu: "Special Offering",
        link: "/records/financials/special-offering",
        icon: "gift",
        isActive: false,
      },
      {
        menu: "Thanksgiving Offering",
        link: "/records/financials/thanksgiving-offering",
        icon: "leaf",
        isActive: false,
      },
      {
        menu: "Mid-Week Offering",
        link: "/records/financials/midweek-offering",
        icon: "cloud-drizzle",
        isActive: false,
      },
    ],
  },
  {
    groupName: "General",
    menuItems: [
      {
        menu: "Announcements",
        link: "/records/general/announcements",
        icon: "megaphone",
        isActive: false,
      },
      {
        menu: "Event Calendar",
        link: "/records/general/calendar",
        icon: "calendar-days",
        isActive: false,
      },
      {
        menu: "Settings",
        link: "/records/general/settings",
        icon: "settings",
        isActive: false,
      },
    ],
  },
];

export const adminExtra = [
  {
    groupName: "User Management",
    menuItems: [
      {
        menu: "New User Registration",
        link: "/records/users/new",
        icon: "user-plus",
        isActive: false,
      },
      {
        menu: "Manage Users",
        link: "/records/users/manage",
        icon: "users",
        isActive: false,
      },
      {
        menu: "Roles and Permissions",
        link: "/records/users/roles",
        icon: "shield-check",
        isActive: false,
      },
      {
        menu: "Financial Reports",
        link: "/records/users/roles",
        icon: "chart-no-axes-combined",
        isActive: false,
      },
    ],
  },
];

export const getMenuByRole = (role: string) => {
  if (role === "admin") return [...baseMenu, ...adminExtra];
  return baseMenu;
};
