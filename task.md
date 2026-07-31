# Complete Enterprise Overhaul (Prisma Edition)

- [x] `[/]` **Prisma Initialization:** Install Prisma, initialize SQLite, and define the complete enterprise schema in `schema.prisma`.
- [x] `[x]` **Database Migration:** Generate the Prisma Client and create the initial `database.sqlite` file.
- [ ] `[ ]` **Auth & JWT Refactor:** Replace Supabase auth checks in `actions.ts` with Prisma database calls and our custom JWT logic.
- [x] `[x]` **Payment Flow Update:** Refactor `mock-pay` to strictly follow the "Quiet Pending Account -> Payment -> Subscription Activation" flow using Prisma.
- [x] `[x]` **Ticket & Entitlement Enforcement:** Rewrite ticket fetching to strictly enforce `package_id` entitlements on the server.
- [ ] `[ ]` **Admin Auth & Config Actions:** Implement loginAdmin, logoutAdmin, checkAdminAuth, updateAdminCredentials, resetVipPin.
- [ ] `[ ]` **Admin Users Actions:** Implement addClientWithSubscription, updateClientStatus.
- [ ] `[ ]` **Admin Tickets Actions:** Implement addTicket, editTicket, deleteTicket (soft delete).
- [ ] `[ ]` **Admin Public Data Actions:** Implement CRUD for Free Hooks, Won Tickets, Testimonials.
- [ ] `[ ]` **Admin Frontend UI Refactor:** Update AdminDashboard.tsx to use Prisma models and new actions.
