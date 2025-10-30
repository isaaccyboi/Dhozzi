import React, { useState, useEffect } from 'react';
import { DhozziUser } from '../types';
import { XIcon, StarIcon, DhollaPayIcon } from './Icons';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: DhozziUser;
    onPaymentSuccess: (newBalance: number) => void;
}

const KRX_TO_AUD_RATE = 5;

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, user, onPaymentSuccess }) => {
    const [formData, setFormData] = useState({
        krxAmount: '100',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardKrxDh: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [newBalance, setNewBalance] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setIsProcessing(false);
            setFormData({
                krxAmount: '100',
                cardName: '',
                cardNumber: '',
                cardExpiry: '',
                cardKrxDh: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.krxAmount || Number(formData.krxAmount) <= 0) {
            newErrors.krxAmount = 'Please enter a valid amount.';
        }
        if (!formData.cardName.trim()) {
            newErrors.cardName = 'Cardholder name is required.';
        }
        if (!formData.cardNumber.startsWith('5694')) {
            newErrors.cardNumber = 'Card number must start with 5694.';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card number must be 16 digits.';
        }
        if (!/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/.test(formData.cardExpiry)) {
            newErrors.cardExpiry = 'Use MM/YY format.';
        } else {
            const [month, year] = formData.cardExpiry.split('/').map(s => parseInt(s.trim(), 10));
            const expiryDate = new Date(2000 + year, month, 0); // Day 0 gives the last day of the previous month
            if (expiryDate < new Date()) {
                newErrors.cardExpiry = 'Card has expired.';
            }
        }
        if (!/^\d{5}$/.test(formData.cardKrxDh)) {
            newErrors.cardKrxDh = 'KRXDH must be 5 digits.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            const updatedBalance = user.krxBalance + Number(formData.krxAmount);
            setNewBalance(updatedBalance);
            onPaymentSuccess(updatedBalance);
            setIsProcessing(false);
            setIsSuccess(true);
        }, 1500); // Simulate API call
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const audAmount = (Number(formData.krxAmount) * KRX_TO_AUD_RATE).toFixed(2);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="w-full max-w-md bg-gray-800/80 border border-white/20 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="p-8 text-center">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                        <p className="text-gray-300 mt-2">
                           You purchased {Number(formData.krxAmount).toLocaleString()} KRX.
                        </p>
                        <div className="mt-6 text-lg">
                            <span className="text-gray-400">New Balance: </span>
                            <span className="font-bold text-yellow-400 flex items-center justify-center gap-2">
                               <StarIcon className="w-5 h-5"/> {newBalance.toLocaleString()} KRX
                            </span>
                        </div>
                        <button onClick={onClose} className="mt-8 w-full p-3 rounded-lg font-semibold bg-[--color-accent] text-white">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">Buy KrunX</h2>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
                            <div>
                                <label htmlFor="krxAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount to Buy (KRX)</label>
                                <input type="number" name="krxAmount" id="krxAmount" value={formData.krxAmount} onChange={handleInputChange} className="input-field" min="1"/>
                                {errors.krxAmount && <p className="error-text">{errors.krxAmount}</p>}
                                <p className="text-sm text-gray-400 mt-2 text-center">Total: <span className="font-semibold text-white">A${audAmount}</span> (1 KRX : 5 AUD)</p>
                            </div>
                            
                            <div className="pt-4 border-t border-white/10">
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">Cardholder Name</label>
                                <input type="text" name="cardName" id="cardName" value={formData.cardName} onChange={handleInputChange} className="input-field" autoComplete="cc-name" />
                                {errors.cardName && <p className="error-text">{errors.cardName}</p>}
                            </div>

                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                                <input type="text" name="cardNumber" id="cardNumber" placeholder="5694 XXXX XXXX XXXX" value={formData.cardNumber} onChange={handleInputChange} className="input-field" maxLength={16} inputMode="numeric" autoComplete="cc-number" />
                                {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-300 mb-1">Expiry</label>
                                    <input type="text" name="cardExpiry" id="cardExpiry" placeholder="MM / YY" value={formData.cardExpiry} onChange={handleInputChange} className="input-field" autoComplete="cc-exp" />
                                    {errors.cardExpiry && <p className="error-text">{errors.cardExpiry}</p>}
                                </div>
                                <div>
                                    <label htmlFor="cardKrxDh" className="block text-sm font-medium text-gray-300 mb-1">KRXDH</label>
                                    <input type="text" name="cardKrxDh" id="cardKrxDh" placeholder="5-digit CVV" value={formData.cardKrxDh} onChange={handleInputChange} className="input-field" maxLength={5} inputMode="numeric" autoComplete="cc-csc" />
                                    {errors.cardKrxDh && <p className="error-text">{errors.cardKrxDh}</p>}
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <button type="submit" disabled={isProcessing} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold bg-gradient-to-r from-[--color-primary-start] to-[--color-primary-end] text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                                    {isProcessing ? 'Processing...' : `Pay A$${audAmount}`}
                                </button>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <span>Powered by</span> <DhollaPayIcon className="h-5 w-auto" />
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>
             <style>{`
                .input-field {
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    color: white;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--color-accent);
                    box-shadow: 0 0 0 1px var(--color-accent);
                }
                .error-text {
                    color: #f87171; /* red-400 */
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default PaymentModal;