const CheckoutForm = ({ amount, planType, userData }) => {
  const navigate = useNavigate();
  
  // Simple function that shows an alert and then navigates
  const handlePayment = () => {
    // Show the alert - this is synchronous and will block execution until dismissed
    window.alert("Payment Successful!");
    
    // After alert is dismissed, navigate to login page
    navigate('/login');
  };

  return (
    <div className="checkout-form">
      <div className="form-group">
        <label htmlFor="card-element">Card Details*</label>
        <div className="card-input-container">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#333',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#dc3545'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name-on-card">Name on Card</label>
        <input 
          type="text" 
          id="name-on-card" 
          className="form-input" 
          placeholder="Name as shown on card"
          defaultValue={userData.name}
          required
        />
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button 
          type="button"
          className="pay-now-btn"
          onClick={handlePayment}
        >
          Pay Now ${amount.toFixed(2)}
        </button>
      </div>
    </div>
  );
};