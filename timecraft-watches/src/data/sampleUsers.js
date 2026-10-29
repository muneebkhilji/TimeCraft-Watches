// Demo accounts used to seed localStorage the first time the app runs.
// IMPORTANT: passwords are stored as plain text because this is a learning demo.
// Never do this in a real application.
export const sampleUsers = [
  {
    id: 'u-admin',
    fullName: 'Store Admin',
    email: 'admin@timecraft.com',
    password: 'Admin@12345',
    role: 'admin',
    createdAt: '2025-01-01T09:00:00.000Z',
  },
  {
    id: 'u-customer',
    fullName: 'Demo Customer',
    email: 'customer@timecraft.com',
    password: 'Customer@123',
    role: 'customer',
    createdAt: '2025-01-02T09:00:00.000Z',
  },
]
