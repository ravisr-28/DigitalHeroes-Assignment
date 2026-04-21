export const sendEmail = async (options) => {
  const { to, subject, body } = options;

  console.log('\n================================');
  console.log('📧 DIRECT EMAIL DISPATCH TRIGGERED!');
  console.log(`📡 To:      ${to}`);
  console.log(`🔔 Subject: ${subject}`);
  console.log(`📝 Body:\n${body}`);
  console.log('================================\n');

  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const EmailTemplates = {
  welcomeDetails: (name) => ({
    subject: "Welcome to Digital Heroes!",
    body: `Hey ${name}!\n\nWelcome to a new era of Impactful Competition.\nYour account is successfully created. Start by navigating to your dashboard, selecting a charity, and locking in your first subscription to begin uploading scores!\n\nBest,\nThe Digital Heroes Team`
  }),
  publishDrawDetails: (month, tierPrize) => ({
    subject: `🚨 Official Draw Results: ${month}`,
    body: `The numbers are in for ${month}! The 5-Match tier prize pool was marked at $${tierPrize.toFixed(2)}.\nLog in now to see if your scores generated a match and begin the verification process!`
  }),
  winnerApprovalAlert: (tier, prizeAmount) => ({
    subject: "🏆 Verification Passed: Winner Payout Initialized!",
    body: `Congratulations! Our admins have successfully verified your score proof for the ${tier} match.\n\nA payout of $${prizeAmount.toFixed(2)} has been authorized to your account. Expect funds transfer shortly.\n\nThank you for playing, and thank you for supporting your charity! `
  })
};
