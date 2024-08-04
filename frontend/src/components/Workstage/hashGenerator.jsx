import md5 from "crypto-js/md5";

const generateHash = (
  merchantSecret,
  merchantId,
  orderId,
  amount,
  currency
) => {
  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const amountFormatted = parseFloat(amount).toFixed(2);
  const hashString = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;
  return md5(hashString).toString().toUpperCase();
};

export default generateHash;
