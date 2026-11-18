export const SUBJECTS = [
  "Mathematics",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Computer Science",
  "English",
  "Bangla",
  "Accounting",
  "Economics",
  "Bangladesh Studies",
  "General Science",
  "Religion",
  "IELTS",
  "Programming",
];

export const CLASS_LEVELS = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "SSC",
  "HSC",
  "Admission",
  "University",
];

export const MODES = ["Online", "Offline"];

export const ROLES = ["student", "tutor"];

export const ROLE_LABELS = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
};

export const STATUS_STYLES = {
  pending: "badge-warning",
  accepted: "badge-success",
  approved: "badge-success",
  rejected: "badge-error",
};

export const PLANS = {
  tutor: {
    id: "pro-tutor",
    name: "Pro Tutor",
    price: 15,
    period: "month",
    role: "tutor",
    features: [
      "Unlimited tuition posts",
      "Verified tutor badge",
      "Priority placement in search",
      "Advanced applicant management",
      "Lower service fees",
    ],
  },
  student: {
    id: "pro-student",
    name: "Pro Student",
    price: 10,
    period: "month",
    role: "student",
    features: [
      "Priority booking on new batches",
      "Save unlimited favourite tuitions",
      "Direct message with tutors",
      "Early access to results & tips",
      "Verified student badge",
    ],
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export const CONTACT = {
  email: "hello@mentorlagbe.com",
  phone: "+880 1711-000000",
  address: "Level 4, Bay's Galleria, Gulshan 1, Dhaka 1212",
};

export const DASHBOARD_NAV = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: "layout" },
    { label: "My Applications", href: "/dashboard/student/my-applications", icon: "file" },
    { label: "Saved Tuitions", href: "/dashboard/student/saved", icon: "bookmark" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "user" },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: "layout" },
    { label: "Post a Tuition", href: "/dashboard/tutor/post-tuition", icon: "plus" },
    { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: "book" },
    { label: "Manage Applicants", href: "/dashboard/tutor/applicants", icon: "users" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "user" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "layout" },
    { label: "User Management", href: "/dashboard/admin/users", icon: "users" },
    { label: "Tuition Approval", href: "/dashboard/admin/tuitions", icon: "book" },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: "card" },
    { label: "Update Profile", href: "/dashboard/profile", icon: "user" },
  ],
};
