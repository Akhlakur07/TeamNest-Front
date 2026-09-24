export const roleHome = (role) => {
  if (role === "platform_admin") return "/admin";
  if (role === "org_admin") return "/org";
  if (role === "org_member") return "/member";
  return "/";
};

export default roleHome;