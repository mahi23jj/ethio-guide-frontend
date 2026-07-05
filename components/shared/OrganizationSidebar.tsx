"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserSidebar } from "./UserSidebar";

const organizationMenuItems = [
  {
    iconSrc: "/icons/dashboard.svg",
    iconAlt: "Dashboard",
    label: "dashboard",
  },
  {
    iconSrc: "/icons/official-notices.svg",
    iconAlt: "Notices",
    label: "notices",
  },
  {
    iconSrc: "/icons/discussions.svg",
    iconAlt: "View Feedbacks",
    label: "feedback",
  },
  {
    iconSrc: "/icons/manage-procedure.svg",
    iconAlt: "Manage Procedures",
    label: "procedures",
  },
];

export default function OrganizationSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItemsWithHandlers = organizationMenuItems.map((item) => {
    const isActive = pathname.startsWith(`/organization/${item.label}`);

    return {
      ...item,
      active: isActive,
      onClick: () => router.push(`/organization/${item.label}`),
    };
  });

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <UserSidebar
      menuItems={menuItemsWithHandlers}
      onLogoutClick={handleLogoutClick}
      settingsLabel="Settings"
      logoutLabel="Sign Out"
    />
  );
}

