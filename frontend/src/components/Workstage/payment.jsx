// import React, { useEffect, useState } from 'react';
// import generateHash from './hashGenerator';
// import { useSearchParams } from 'react-router-dom';

// const PaymentFormPage = () => {
//   const [searchParams] = useSearchParams();
//   const [formData, setFormData] = useState({});
  
//   useEffect(() => {
//     const orderId = searchParams.get('orderId');
//     const total = searchParams.get('total');

//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//     const formData = {
//       merchant_id: '1227808',
//       return_url: 'http://localhost:5173',
//       cancel_url: 'http://localhost:5173/cart',
//       notify_url: 'https://sandbox.payhere.lk/merchant/home',
//       order_id: orderId,
//       items: `Order ${orderId}`,
//       currency: 'LKR',
//       amount: total,
//       first_name: userInfo.firstName,
//       last_name: userInfo.lastName,
//       email: userInfo.email,
//       phone: userInfo.phone,
//       address: userInfo.address,
//       city: userInfo.city,
//       country: 'Sri Lanka',
//     };

//     const hash = generateHash(
//       'MTY0OTg2ODk5MTExMjgwOTcxMDIyMjU0MjkwNTEzNzQzOTA3Nzk1', // Your merchant secret
//       formData.merchant_id,
//       formData.order_id,
//       formData.amount,
//       formData.currency
//     );

//     setFormData({ ...formData, hash });
//   }, [searchParams]);

//   return (
//     <form id="payment-form" method="post" action="https://sandbox.payhere.lk/pay/checkout">
//       {Object.entries(formData).map(([key, value]) => (
//         <input type="hidden" name={key} value={value} key={key} />
//       ))}
//       <input type="submit" value="Buy Now" />
//     </form>
//   );
// };

// export default PaymentFormPage;
