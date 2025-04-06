export const generatePseudonym = () => {
  const prefix = 'User';
  const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generates number between 1000-9999
  return `${prefix}#${randomNumber}`;
};

export const validatePseudonym = (pseudonym) => {
  const regex = /^User#\d{4}$/;
  return regex.test(pseudonym);
}; 