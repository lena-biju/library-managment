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
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Payment processing is not available. Please try again later.');
      setProcessing(false);
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

          // Get existing transactions or initialize empty arrays
          const userTransactions = JSON.parse(localStorage.getItem('userTransactions') || '{}');
          if (!userTransactions[currentUser.phone]) {
            userTransactions[currentUser.phone] = {
              purchased: [],
              rented: []
            };
          }

          // Add the new transaction
          if (action === 'buy') {
            userTransactions[currentUser.phone].purchased.push(transaction);
          } else {
            userTransactions[currentUser.phone].rented.push(transaction);
          }

          // Save back to localStorage
          localStorage.setItem('userTransactions', JSON.stringify(userTransactions));
        }

        // Show success message and redirect
        setTimeout(() => {
          alert(`Successfully ${action === 'buy' ? 'purchased' : 'rented'} "${bookTitle}"!`);
          navigate('/account');
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-row">
        <label htmlFor="card-element">Card Information</label>
        <div className="card-element-container">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#4A2B0F',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  ':-webkit-autofill': {
                    color: '#fce883',
                  },
                },
                invalid: {
                  color: '#dc3545',
                  iconColor: '#dc3545'
                }
              },
              hidePostalCode: true
            }}
          />
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={!stripe || processing} className="pay-button">
        {processing ? (
          <span className="processing">
            Processing... <i className="fas fa-spinner fa-spin"></i>
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>
      <div className="secure-payment-notice">
        <i className="fas fa-lock"></i>
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
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
            <h2>Payment Details</h2>
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