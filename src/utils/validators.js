// Validate college email
export const isCollegeEmail = (email) => {
  return /@geu\.ac\.in$|@gehu\.ac\.in$/i.test(email);
};

// Validate 4-digit OTP
export const isValidOTP = (otp) => {
  return /^\d{4}$/.test(otp);
};
