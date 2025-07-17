export const validatePhilippinePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Philippine mobile number patterns:
  // 09XXXXXXXXX (11 digits)
  // +639XXXXXXXXX (13 digits with country code)
  // 639XXXXXXXXX (12 digits with country code, no +)
  
  const patterns = [
    /^09\d{9}$/, // 09XXXXXXXXX
    /^639\d{9}$/, // 639XXXXXXXXX
    /^\+639\d{9}$/, // +639XXXXXXXXX
  ];
  
  return patterns.some(pattern => pattern.test(phone));
};

export const formatPhilippinePhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('639')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('09')) {
    return `+63${cleanPhone.substring(1)}`;
  }
  
  return phone;
};