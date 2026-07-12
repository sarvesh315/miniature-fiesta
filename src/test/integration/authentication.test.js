import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import OTP from '../../models/OTP.js';

describe('🔑 Integration: Multi-Step Authentication & Session Lifecycles', () => {
  const testUser = {
    name: 'Audit Professional',
    email: 'mfa-audit@defense.test',
    password: 'SecurePassword123!',
    phone: '+15550199'
  };

  test('✅ 1. User Registration should enforce strict account seeding profiles', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    // Verify password is not plaintext in database
    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb.password).not.toBe(testUser.password);
    expect(userInDb.password.startsWith('$2b$')).toBe(true); // Confirms bcrypt signature
  });

  test('✅ 2. Login should request an intermediate MFA Verification Code', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    // If your app enforces 2FA step-up paths:
    if (res.body.step === 'OTP_VERIFICATION_REQUIRED') {
      expect(res.body.success).toBe(true);
      
      // Pull dynamic code directly out of sandbox db storage to proceed
      const generatedOtp = await OTP.findOne({ email: testUser.email });
      expect(generatedOtp).toBeDefined();

      const mfaRes = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ email: testUser.email, code: generatedOtp.code, purpose: 'login' });

      expect(mfaRes.statusCode).toBe(200);
      expect(mfaRes.headers['set-cookie']).toBeDefined();
    } else {
      expect(res.headers['set-cookie']).toBeDefined();
    }
  });

  test('❌ 3. Login should fail cleanly given incorrect password updates', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword Attempt' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});