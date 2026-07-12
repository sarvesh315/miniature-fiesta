import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';

describe('🔬 Integration: Input Sanitization & Data Casting Protections', () => {
  let sessionCookies = null;
  let csrfToken = null;
  const targetEmail = 'sanitizer-profile@defense.test';

  beforeAll(async () => {
    // Register baseline user to establish execution tokens
    await request(app).post('/api/v1/auth/register').send({
      name: 'Sanitizer Target',
      email: targetEmail,
      password: 'SecurePassword123!',
      phone: '+15558883333'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: targetEmail, password: 'SecurePassword123!' });

    sessionCookies = loginRes.headers['set-cookie'];
    const csrfCookieStr = sessionCookies.find(c => c.startsWith('csrfToken='));
    csrfToken = csrfCookieStr.split(';')[0].split('=')[1];
  });

  test('🛡️ Should intercept and completely strip out malicious script tags from fields', async () => {
    const response = await request(app)
      .put('/api/v1/profile')
      .set('Cookie', sessionCookies)
      .set('X-CSRF-Token', csrfToken)
      .send({
        name: 'Safe Name Text',
        bio: '<script>alert("XSS Payload Execution")</script>Standard Biography Text Content'
      });

    expect(response.statusCode).toBe(200);

    // Pull directly out of database to ensure clean string storage values hold
    const updatedUser = await User.findOne({ email: targetEmail });
    expect(updatedUser.bio).not.toContain('<script>');
    expect(updatedUser.bio).toContain('Standard Biography Text Content');
  });

  test('❌ Should neutralize malicious polymorphic NoSQL Operator inputs', async () => {
    // Malicious actor passes object configuration modifiers instead of standard text string data
    const injectedAttackPayload = {
      email: { $ne: 'attacker-account@system.test' },
      password: { $gt: '' }
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(injectedAttackPayload);

    // Threat neutralized! Internal casting filters flatten objects into strict literal query strings
    expect(response.statusCode).not.toBe(200);
    expect(response.body.success).toBe(false);
  });
});