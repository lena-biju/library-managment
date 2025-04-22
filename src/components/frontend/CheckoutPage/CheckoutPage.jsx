import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { getBookById } from '../../../booksData';
import './CheckoutPage.css';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51R9pcxFKAbOgKGpu57qRRyRYiXLJgIKuxE69iWaImZe8hpgoMuTYjxAyrUY4t28bRiPQ7EzCsFPcFfrsMDVEN2cs00tCMEd84g');

const CheckoutForm = ({ amount, bookTitle, book, action }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // 'processing', 'success', 'error'
  const navigate = useNavigate();

  const handlePayment = async (event) => {
    event.preventDefault();
    setShowPaymentOverlay(true);
    setProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    if (!stripe || !elements) {
      setError('Payment processing is not available. Please try again later.');
      setProcessing(false);
      setPaymentStatus('error');
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        setPaymentStatus('error');
      } else {
        // Save the transaction to user's profile
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          const transaction = {
            bookId: book.id,
            bookTitle: book.title,
            coverImage: book.coverImage,
            transactionType: action,
            amount: amount,
            date: new Date().toISOString(),
            paymentId: paymentMethod.id
          };

          const userTransactions = JSON.parse(localStorage.getItem('userTransactions') || '{}');
          if (!userTransactions[currentUser.phone]) {
            userTransactions[currentUser.phone] = {
              purchased: [],
              rented: []
            };
          }

          if (action === 'buy') {
            userTransactions[currentUser.phone].purchased.push(transaction);
          } else {
            userTransactions[currentUser.phone].rented.push(transaction);
          }

          localStorage.setItem('userTransactions', JSON.stringify(userTransactions));

          // Show success state and redirect after delay
          setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
              navigate('/account');
            }, 1500);
          }, 2000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
      setPaymentStatus('error');
    }
  };

  return (
    <>
      <form onSubmit={handlePayment} className="checkout-form">
        <div className="form-group">
          <label htmlFor="card-number">Card Number*</label>
          <div className="card-input-container">
            <CardElement
              id="card-number"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#333',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
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

        <div className="form-row-split">
          <div className="form-group half">
            <label htmlFor="exp-month">Exp. Month*</label>
            <select id="exp-month" className="form-select">
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="exp-year">Exp. Year*</label>
            <select id="exp-year" className="form-select">
              {Array.from({ length: 10 }, (_, i) => {
                const year = (new Date().getFullYear() + i).toString().slice(-2);
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="security-code">Security Code*</label>
          <input type="text" id="security-code" className="form-input" maxLength="4" />
        </div>

        <div className="form-group">
          <label htmlFor="name-on-card">Name on Card</label>
          <input type="text" id="name-on-card" className="form-input" placeholder="Name as shown on card" />
        </div>

        <div className="form-group checkbox">
          <input type="checkbox" id="primary-payment" />
          <label htmlFor="primary-payment">Make this the primary payment method</label>
          <span className="info-icon">i</span>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>CANCEL</button>
          <button 
            type="submit" 
            className="pay-now-btn" 
            disabled={!stripe || processing}
          >
            {processing ? (
              <span className="processing">
                <span className="spinner-small"></span>
                Processing...
              </span>
            ) : (
              <>Pay Now ${amount.toFixed(2)}</>
            )}
          </button>
        </div>
      </form>

      {showPaymentOverlay && (
        <div className="payment-overlay">
          <div className="payment-overlay-content">
            {paymentStatus === 'processing' && (
              <>
                <div className="payment-animation">
                  <div className="spinner"></div>
                </div>
                <h3>Processing Your Payment</h3>
                <p>Please wait while we process your payment...</p>
              </>
            )}
            
            {paymentStatus === 'success' && (
              <>
                <div className="payment-animation">
                  <div className="success-checkmark">✓</div>
                </div>
                <h3>Payment Successful!</h3>
                <p>Thank you for your {action === 'buy' ? 'purchase' : 'rental'} of "{bookTitle}".</p>
                <p className="redirect-notice">Redirecting to your account...</p>
              </>
            )}

            {paymentStatus === 'error' && (
              <>
                <div className="payment-animation">
                  <div className="error-icon">✕</div>
                </div>
                <h3>Payment Failed</h3>
                <div className="payment-error">{error}</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const CheckoutPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get('action');
  const amount = action === 'buy' ? 29.99 : 9.99;

  useEffect(() => {
    const loadBook = async () => {
      try {
        const bookData = getBookById(parseInt(id));
        if (!bookData) {
          throw new Error('Book not found');
        }

        // Import the cover image
        const coverImage = require(`../../../assets/books/covers/${bookData.id}_${bookData.title.toLowerCase().replace(/ /g, '-')}.jpg`);
        
        setBook({
          ...bookData,
          coverImage
        });
      } catch (err) {
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  if (loading) {
    return (
      <div className="checkout-page">
        <Navigation />
        <main className="checkout-content paper-background">
          <div className="loading">Loading checkout details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="checkout-page">
        <Navigation />
        <main className="checkout-content paper-background">
          <div className="error-container">
            <p className="error-message">{error || 'Book not found'}</p>
            <button onClick={() => navigate('/')} className="return-home">
              Return to Homepage
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navigation />
      
      <main className="checkout-content paper-background">
        <div className="checkout-container">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="book-info">
              <img src={book.coverImage} alt={book.title} className="book-thumbnail" />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p>by {book.author.name}</p>
                <p className="action-type">
                  {action === 'buy' ? 'Purchase' : 'Monthly Rental'}
                </p>
                <p className="price">${amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-header">
              <h2>Payment Information</h2>
              <div className="card-brands">
                <img src="/assets/images/payment/visa.png" alt="Visa" />
                <img src="/assets/images/payment/mastercard.png" alt="Mastercard" />
                <img src="/assets/images/payment/amex.png" alt="American Express" />
                <img src="/assets/images/payment/discover.png" alt="Discover" />
                <img src="/assets/images/payment/jcb.png" alt="JCB" />
                <img src="/assets/images/payment/diners.png" alt="Diners Club" />
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                amount={amount} 
                bookTitle={book.title}
                book={book}
                action={action}
              />
            </Elements>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage; 