'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

const WhatsAppVerificationForm = ({ setIsModalOpen }) => {
  const [phoneNumber, setPhoneNumber] = useState('+7'); // Initialize with +7
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Ensure the input starts with +7 and doesn't allow removing it
    if (input.startsWith('+7')) {
      setPhoneNumber(input);
    } else {
      setPhoneNumber('+7');
    }
  };

  const handleSendCode = async () => {
    const code = generateRandomCode();
    setGeneratedCode(code);
    setVerificationCode('');
    const formattedPhoneNumber = phoneNumber.replace('+', '');

    try {
      const response = await axios.post('http://localhost:3001/send-code', {
        number: formattedPhoneNumber,
        code: code,
      });

      if (response.data.success) {
        setStatus('Code sent successfully!');
      } else {
        setStatus('Failed to send code.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error sending code.');
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setStatus('Verification successful!');
    } else {
      setStatus('Invalid code. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
          <Dialog.Title className="text-lg font-semibold text-center">WhatsApp Verification</Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="+7XXXXXXXXXX"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={phoneNumber.length <= 2}
              className="w-full bg-blue-600 text-white p-3 rounded-md disabled:bg-gray-400"
            >
              Send Code
            </button>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
              <input
                id="verificationCode"
                type="text"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={!verificationCode}
              className="w-full bg-green-600 text-white p-3 rounded-md disabled:bg-gray-400"
            >
              Verify Code
            </button>
          </div>
          <Dialog.Description className="text-center mt-2 text-gray-700">
            {status}
          </Dialog.Description>

          <div className="mt-4 flex justify-center">
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default WhatsAppVerificationForm;
