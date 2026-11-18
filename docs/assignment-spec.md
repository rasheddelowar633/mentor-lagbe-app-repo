Assignment 9 - Category: 001
Requirement Video: b-14-a-9-cat-001.mp4
________________________________________
⚠️ Caution: Please follow this document properly and do not copy the design of the website provided in the video. If the video shows something different which is not in this doc then don’t follow the video, follow this Doc. If you have any confusion or problem then join support session to get a clear idea
Assignment 9 - Category: 001
Project Name: MentorLagbe

Candidate Selection & Job Task Letter
Dear Candidates,
We are pleased to inform you that you have successfully passed the first round of the selection process!! 🎉
Your application and skills have impressed us, and we are excited to move forward with you in the next stages. We are excited to have you explore this opportunity with us. This project is designed to assess your skills, creativity, and problem-solving abilities. It will help us understand how you approach challenges and your ability to deliver high-quality solutions.

Project Name: MentorLagbe (Smart Tuition & Mentorship Platform)
Project Overview and Discussion
●	Project Theme: EdTech / Online & Home Tuition Finder and Booking Platform.
●	What is the Project: MentorLagbe is a full-stack role-based tuition management platform built with Next.js, Express, MongoDB, BetterAuth, JWT, and Stripe. It connects qualified Tutors who offer subject-wise tuition batches or 1-on-1 mentorship with Students looking for personalized academic guidance, while Admins moderate listings, users, and subscription payments.
●	Why We Should Develop the Project: Students and parents in Bangladesh and worldwide struggle to find verified tutors by subject, class level, mode (Online/Offline), and monthly budget. Similarly, skilled tutors lack a structured platform to showcase their batches and manage student enrollments. MentorLagbe solves both problems in one unified ecosystem.
●	How the System Works: Users register as a Student or Tutor. Tutors post tuition listings (with ImgBB/Cloudinary banner upload) and manage incoming student applications. Admins approve or reject tuition posts, manage user roles, and track Stripe revenue. Students search and filter approved tuitions, apply for sessions, and track application status in real time. Both Tutors and Students can upgrade to the Pro Plan using Stripe.
●	Similar Websites / Design Inspiration Links: 
• Preply (Tutor Listing & Card Design): https://preply.com/
• Superprof (Clean Search & Subject Filter): https://www.superprof.com/
• Caretutors (Local Tuition Workflow): https://caretutors.com/
• ThemeForest EdTech / Tutor Templates: https://themeforest.net/search/tutor%20marketplace
Ensure the Following Things to Get 100% Mark (No Mark Will Contain)
●	Include at least 20 meaningful commits on the client side & 12 meaningful commits on the server side with descriptive messages.
●	Include a README.md file with the project name, purpose, live URL, Admin credentials, key features, and any npm packages you have used.
●	Secure Frontend configuration keys using environment variables (.env.local).
●	Secure your MongoDB, BetterAuth, JWT, ImgBB, and Stripe credentials using environment variables (.env).
●	Create a design that encourages recruiters. Color contrast should please the eye & ensure that the website has proper alignment, space, and the website does not express gobindo design.
●	If we find your project similar to any project of your module / conceptual / assignment, you will get 0 and may miss the chance of any upcoming reward.
Deployment Guideline
●	If your Deployment is not okay you will get 0 and may miss the chance of our upcoming rewards.
●	Ensure that your server is working perfectly on production and not throwing any CORS / 404 / 504 Errors.
●	Ensure that your Live Link is working perfectly and that it is not showing errors on Landing in your system.
●	⚠️ Ensure that the page doesn't throw any error on reloading from any routes.
●	⚠️ Logged in User must not redirect to Login on reloading any private route.

Logical Data Design & Database Architecture (4 Collections)
Before writing any code, review the logical database design below. The system has 3 Stakeholders (Student, Tutor, Admin) and uses exactly 4 MongoDB Collections.
Collection Name	Created / Updated By	Primary Purpose	Key Fields
1. users	BetterAuth (Sign Up) / Profile Update / Admin / Stripe Webhook	Stores all users, their role, profile photo (ImgBB(optional)/image URL), and subscription plan.	_id, name, email, image, role ('student' | 'tutor' | 'admin'), phone, bio, plan ('free' | 'pro'), createdAt
2. tuitions	Created & managed by Tutor; Approved/Rejected by Admin	Stores all tuition batches & 1-on-1 mentorship posts.	_id, title, subject, classLevel, mode ('Online' | 'Offline'), location, monthlyFee, daysPerWeek, bannerImage, description, tutorName, tutorEmail, approvalStatus ('pending' | 'approved' | 'rejected'), isActive, createdAt
3. applications	Submitted by Student; Status updated by Tutor	Stores student enrollment/booking applications for tuition posts.	_id, tuitionId, tuitionTitle, subject, monthlyFee, tutorEmail, studentName, studentEmail, studentPhone, preferredSchedule, studentNote, status ('pending' | 'accepted' | 'rejected'), appliedAt
4. payments	Created via Stripe Checkout & Webhook	Stores Pro subscription transaction records for Tutors & Students.	_id, userEmail, userName, userRole, planName, amount, currency, transactionId, stripeSessionId, paymentStatus ('paid'), paidAt

How the 4 Collections Connect (Logical Workflow)
●	Step 1 (Role Registration): When a user signs up on MentorLagbe via BetterAuth, they choose their role ('student' or 'tutor'). Their account is saved in the users collection with plan: 'free'.
●	Step 2 (Posting a Tuition): A Tutor creates a tuition post from their dashboard. It is saved in the tuitions collection with approvalStatus: 'pending' and isActive: true. (Free Tutors can post up to 2 tuitions; Pro Tutors can post unlimited tuitions).
●	Step 3 (Admin Moderation): An Admin reviews newly created posts in the Admin Dashboard and updates approvalStatus to 'approved' or 'rejected'. Only 'approved' and 'isActive: true' posts appear on the public Browse Tuitions page.
●	Step 4 (Student Application): A Student browses approved tuitions, views the Tuition Details page, and submits the Apply Form. A document is created in the applications collection linking tuitionId, tutorEmail, and studentEmail with status: 'pending'.
●	Step 5 (Tutor Applicant Management): The Tutor views all applicants for their tuition posts in the Tutor Dashboard and updates each application's status to 'accepted' or 'rejected'.
●	Step 6 (Stripe Subscription Upgrade): When a Tutor or Student purchases a Pro Plan via Stripe Checkout, the Stripe Webhook (or session verification) inserts a payment record in the payments collection and updates plan: 'pro' in the users collection.

Layout & Page Structure
1. Requirement for Navbar
●	Logo & Brand Name: MentorLagbe (keep the heading/logo the same style and size as on the home page).
●	Public Navigation Items: Home (/), Browse Tuitions (/tuitions), Pricing / Pro Plans (/pricing), and How It Works / About.
●	Navbar State for Unauthenticated Users: Show 'Sign In' and 'Sign Up' buttons.
●	Navbar State for Authenticated Users: Display User Profile Image (Avatar), User Name & Role Badge (Student / Tutor / Admin), 'Dashboard' link, 'Update Profile' link, and a 'Sign Out' button.
2. Requirement for Footer
●	Content: MentorLagbe logo, brief tagline, quick navigation links, contact info (email/phone/location), copyright text, and social media links (must use the new X logo instead of the old Twitter bird).
3. Requirement for Main Layout & Pages (All Possible Pages to Develop)
●	Home Page (/): Landing page with banner, dynamic tuitions, animations, pricing, and extra sections.
●	Browse Tuitions Page (/tuitions): Grid view of all Admin-approved & active tuition listings with search and filter.
●	Tuition Details Page (/tuitions/[id]): Detailed view of a single tuition post with Tutor details and the 'Apply for Tuition' form/modal (accessible for application only by Students).
●	Pricing / Pro Plans Page (/pricing): Stripe subscription tiers for Free vs. Pro Tutors and Students.
●	Sign Up Page (/sign-up) & Sign In Page (/sign-in): Role-based registration and login pages.
●	Payment Status Pages (/payment/success & /payment/cancel): Stripe checkout redirection pages.
●	Update Profile Page (/dashboard/profile): Profile editing with ImgBB image upload(optional)/image URL.
●	Role-Based Dashboards (/dashboard/...): Dynamic routes for Student, Tutor, and Admin.
Authentication System
●	BetterAuth & Database Connection: Set up BetterAuth with the MongoDB adapter on your backend and connect it to the Next.js frontend.
●	Requirement for Sign Up Page (/sign-up): Include fields for Full Name, Email, Password, and a Role Selection input ('Student' or 'Tutor'). By default, set the user's subscription plan to 'free'. Implement form validation for required fields, email format, and password length.
●	Requirement for Sign In Page (/sign-in): Implement Email and Password sign-in with proper form validation and error toast notifications. (Optional: Add Google Social Login via BetterAuth).
●	JWT Token Integration: Upon login, retrieve/generate a JWT token on the client side and send it for protected backend API requests.
Home Page Requirements
●	1. Hero / Banner Section: Built cleanly following modern UI principles with an engaging headline (e.g., 'Find Your Ideal Tutor or Mentorship Batch Today'), search/CTA button leading to Browse Tuitions, and high-quality illustration/photo.
●	2. Dynamic Featured Tuitions Section: Fetch and display 6 latest Approved & Active tuition listings from MongoDB. Each card must have equal height and width and show Title, Subject, Class Level, Mode (Online/Offline), Monthly Fee, Tutor Name, and a 'View Details' button.
●	3. Pricing / Subscription Section: Highlight Free vs. Pro Plans for Tutors and Students with a 'Subscribe with Stripe' CTA button.
●	4. Extra Section 1 — How MentorLagbe Works: A 3-step or 4-step visual workflow explaining how students find tutors and how tutors post batches.
●	5. Extra Section 2 — Top Subjects / Platform Statistics & Testimonials: Show popular subject categories (Math, Physics, Programming, IELTS) along with verified student/tutor counters or feedback cards.
Browse Tuitions, Tuition Details & Applications
●	Browse Tuitions Page (/tuitions): Fetch and display all tuition posts where approvalStatus === 'approved' and isActive === true. Include a Search bar (by Title/Subject) and Filter dropdowns (by Subject, Class Level, or Mode: Online/Offline).
●	Tuition Details Page (/tuitions/[id]): Show complete information about the tuition post (Banner image, Title, Subject, Class Level, Schedule, Location/Mode, Monthly Fee, Description, and Tutor profile summary).
●	Role-Restricted Application Flow: Allow ONLY users with the 'student' role to apply for tuitions. If a Tutor or Admin visits the details page, the 'Apply Now' button must be disabled or hidden with a notice. When a Student submits the application form (Phone, Preferred Schedule, Learning Note), save it to the applications collection with status: 'pending'. Prevent duplicate applications from the same student for the same tuition.
Stripe Subscription Checkout & Webhook / Database Sync
●	Stripe Subscription Payment System (Core Requirement): Implement Stripe Checkout for upgrading to the Pro Plan for Tutors ($15) and Students ($10). automatically update the user's plan to 'pro' in the users collection upon successful payment, and record all transaction details in the payments collection.
Dashboard Layout (Each Requirement Contains 1-5 Marks)
Build a responsive Dashboard Layout with a collapsible sidebar toggle, top bar, user profile summary, and dynamic routing based on the logged-in user's role ('student', 'tutor', or 'admin').
1. Dashboard for Student (Role: 'student')
●	Route — /dashboard/student (Overview): Display reusable dashboard stats cards (Total Applied Tuitions, Accepted Applications, Pending Applications, Current Plan: Free/Pro).
●	Route — /dashboard/student/my-applications (My Applications): Display a table or card grid of all tuitions the student has applied for (Tuition Title, Tutor Name & Email, Monthly Fee, Applied Date, and Status Badge: Pending / Accepted / Rejected). Allow the student to Cancel/Delete an application while its status is still 'pending'.
2. Dashboard for Tutor (Role: 'tutor')
●	Route — /dashboard/tutor (Overview): Display reusable dashboard stats cards (Total Tuitions Posted, Active/Approved Tuitions, Total Applicants Received, Current Plan: Free/Pro).
●	Route — /dashboard/tutor/post-tuition (Post a Tuition Page): Create a validated form to post a new tuition (Title, Subject, Class Level, Mode, Location, Monthly Fee, Days/Week, Description, and Banner Image uploaded via ImgBB API). Save with approvalStatus: 'pending'. Note: Free Plan Tutors can create up to 2 tuition posts; Pro Plan Tutors can create unlimited posts.
●	Route — /dashboard/tutor/my-tuitions (My Created Tuitions - Full CRUD): Display all tuitions created by the logged-in tutor showing Admin approvalStatus ('pending', 'approved', 'rejected') and active status. Tutors can Edit/Update tuition details, Delete a tuition post, and Toggle status (Active / Closed).
●	Route — /dashboard/tutor/applicants (Manage Applicants): Display all students who applied to the tutor's tuition posts (Student Name, Email, Phone, Preferred Schedule, Note, Tuition Title). Allow the Tutor to update application status to 'Accepted' or 'Rejected'.
3. Dashboard for Admin (Role: 'admin')
●	Route — /dashboard/admin (Overview): Display reusable stats cards (Total Users, Total Tutors, Pending vs. Approved Tuitions, Total Stripe Revenue) showing platform statistics.
●	Route — /dashboard/admin/users (User Management): Display all registered users and manage user roles ('student', 'tutor', 'admin') using the BetterAuth Admin plugin or protected Express admin endpoints.
●	Route — /dashboard/admin/tuitions (Admin Tuition Approval Flow): Display all tuition posts submitted by tutors. Admin can Approve (approvalStatus: 'approved') or Reject (approvalStatus: 'rejected') any listing.
●	Route — /dashboard/admin/transactions (Transaction Management): Display all Stripe subscription payment records from the payments collection (User Name, Email, Role, Plan Name, Amount, Transaction ID, Payment Date).
4. Shared Route for All Roles: Update Profile & Stripe Payment
●	Route — /dashboard/profile (Update Profile Page): Every logged-in user (Student, Tutor, Admin) can update their Name, Phone, Bio, and upload a Profile Picture using the ImgBB API(optional)/image URL.
●	Stripe Payment & Webhook Integration: Set up Stripe Checkout Session for purchasing the Pro Plan (e.g., Pro Tutor Plan $15 for unlimited posts & verified badge; Pro Student Plan $10 for priority booking). Handle /payment/success and /payment/cancel pages. Use Stripe Webhook (or checkout verification) to save the transaction in the payments collection and update plan: 'pro' in the users collection.
Additional Requirements
●	1. Requirement for Loading Page: Create a custom loading state / skeleton loader (loading.tsx or spinner component) that displays smoothly while fetching data on pages and dashboard routes.
●	2. Requirement for Error Page: Create a custom 404 Not Found page (not-found.tsx) and error boundary page (error.tsx) with a clear message and a 'Back to Home' button.
●	3. Other Requirements: Use toast notifications (sonner / react-hot-toast) for all form submissions, login/logout, CRUD operations, and error alerts. Seed realistic connected initial data (at least 10-12 approved tuitions across different subjects) so the live site looks rich and complete.
UI Design Requirements
Unique Design: First, decide what kind of website you want to make. Then, search online or check out websites like ThemeForest to get ideas for the design. But remember, your website idea shouldn't be similar to any projects you've done before or to any examples in our modules or conceptual sessions. You can also look for free resources on blogs to help with your website.
●	Keep the main heading style (font, size, color) consistent across all sections.
●	Keep paragraph spacing balanced and text easily readable.
●	Maintain uniform image sizes and spacing.
●	Use the same button style as on the home page.
●	Ensure good spacing and proper alignment.
●	Navbar: Keep the heading/logo same style and size as on the home page.
●	Use a grid layout with equal image sizes.
●	Keep all cards equal height and width (especially in services, projects, or products section).
●	Use the new X logo instead of the old Twitter bird to match the latest rebrand.
●	Responsiveness: Make it responsive for all devices, including mobile, tablet, and desktop views.
Dashboard UI Requirements
●	Responsive design for mobile and tablet screens
●	Consistent color theme
●	Full-width dashboard
●	User profile section
Resources
• https://uiverse.io/  
• https://devmeetsdevs.com/ 
• https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5 
• https://themeforest.net/ 
• https://codecanyon.net/ 
Challenge Part
Challenge 1: Server-Side Search & Filter on Browse Tuitions
●	Requirement: Implement dynamic server-side search (by tuition title or subject), filter (by class level and mode: Online/Offline) on the Browse Tuitions page.

Challenge 2: JWT Token Verification & Role-Based Middlewares
●	Requirement: Secure your backend API routes by verifying the JWT token and checking user roles using custom Express middlewares: verifyToken, verifyStudent, verifyTutor, and verifyAdmin.


Challenge 3: Image Uploading System Using ImgBB API
●	Requirement: Implement direct image file upload (instead of pasting image URLs) using the ImgBB API on both the Update Profile page and the Tutor's Post a Tuition page.

Optional Requirements (Complete 2 to 5 to Differentiate Your Project)
●	1. Server-Side Pagination: Add pagination controls (Previous, Next, Page numbers) on the Browse Tuitions page using MongoDB .skip() and .limit().
●	2. AI Fake Connected Data Seeding: Create a seed script or endpoint using AI-generated realistic JSON data to populate connected tutors, tuitions, and sample applications
●	3. Bookmark / Saved Tuitions for Students: Allow students to save/bookmark favorite tuition listings and view them in a 'Saved Tuitions' tab inside their dashboard.
●	4. Dark / Light Theme Toggle: Implement a smooth Dark and Light mode switcher across both the landing pages and the dashboard.
●	5. Student Review & Rating System: Allow students whose application status is 'accepted' to submit a 1–5 star rating and feedback on that tuition post.
Tech Stack & Submission Guidelines
FrontEnd	Next.js (App Router), HeroUI / DaisyUI / Shadcn UI, TypeScript / JavaScript
Authentication & Authorization	BetterAuth, MongoDB Adapter, JWT with Role-Based Authentication
Backend	Node.js, Express.js, MongoDB, TypeScript (if comfortable) / JavaScript
Payment & Media	Stripe (Checkout & Webhooks), ImgBB API (Image Upload)

What to Submit
Submission Checklist
• Admin Email: 
• Admin Password: 
• Tutor Email & Password (for quick testing): 
• Live Site Link: 
• GitHub Repository (Server): 
• GitHub Repository (Client): 

