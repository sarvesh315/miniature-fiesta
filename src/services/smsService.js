export const sendTransactionalSMS = async (phoneNumber, textPayload) => {
  // Integration hook for clean multi-factor delivery pipelines (e.g., Twilio or Vonage)
  console.log(`📱 SMS Notification dispatched to ${phoneNumber}: "${textPayload}"`);
  return { deliveryStatus: 'queued' };
};