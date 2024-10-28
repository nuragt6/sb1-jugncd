import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Car, MapPin, Users, Phone } from 'lucide-react';

interface Location {
  name: string;
  price: number;
}

const FIXED_LOCATIONS: Location[] = [
  { name: 'Government Polytechnic College to Sahatwar Station', price: 20 },
  { name: 'Government Polytechnic College to Bisauli', price: 20 },
  { name: 'Government Polytechnic College Basdeeh Ballia to Ballia Station', price: 70 },
];

const VEHICLES = [
  { id: 'bike', name: 'Bike', pricePerKm: 7 },
  { id: 'taxi-battery', name: 'Taxi Battery', pricePerKm: 10 },
  { id: 'bolero', name: 'Bolero', fixedPrice: 800 },
  { id: 'scorpio', name: 'Scorpio', fixedPrice: 800 },
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    passengers: 1,
    location: '',
    customPickup: '',
    customDropoff: '',
    distance: 0,
    vehicle: 'bike',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [fare, setFare] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedFare = calculateFare();
    setFare(calculatedFare);
    setShowPayment(true);

    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        fare: calculatedFare,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const calculateFare = () => {
    const { passengers, location, distance, vehicle } = formData;
    let fare = 0;

    if (location && location !== 'custom') {
      const fixedLocation = FIXED_LOCATIONS.find(loc => loc.name === location);
      if (fixedLocation) {
        fare = fixedLocation.price * passengers;
      }
    } else {
      const selectedVehicle = VEHICLES.find(v => v.id === vehicle);
      if (selectedVehicle.fixedPrice) {
        fare = selectedVehicle.fixedPrice;
      } else {
        fare = distance * selectedVehicle.pricePerKm * passengers;
      }
    }

    return fare;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-8">
          <div className="flex items-center justify-center mb-8">
            <Car className="w-12 h-12 text-yellow-400" />
            <h2 className="ml-3 text-3xl font-bold text-white">Taxico</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                Number of Passengers
              </label>
              <input
                type="number"
                min="1"
                required
                className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData.passengers}
                onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                Select Location
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="">-- Select a Location --</option>
                {FIXED_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc.name}>
                    {loc.name} (₹{loc.price} per person)
                  </option>
                ))}
                <option value="custom">Custom Location</option>
              </select>
            </div>

            {formData.location === 'custom' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-300">Pickup Location</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={formData.customPickup}
                    onChange={e => setFormData({ ...formData, customPickup: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Dropoff Location</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={formData.customDropoff}
                    onChange={e => setFormData({ ...formData, customDropoff: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Distance (km)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={formData.distance}
                    onChange={e => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                  />
                </div>
              </>
            )}

            <div>
              <label className="flex items-center text-sm font-medium text-gray-300">
                <Car className="w-4 h-4 mr-2" />
                Select Vehicle
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData.vehicle}
                onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
              >
                {VEHICLES.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.fixedPrice ? `₹${vehicle.fixedPrice} fixed` : `₹${vehicle.pricePerKm}/km`})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
            >
              Book Now
            </button>
          </form>
        </div>
      </motion.div>

      {showPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowPayment(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Total Fare: ₹{fare}</h3>
            <img
              src="https://i.ibb.co/yS5V6BX/file.jpg"
              alt="QR Code for Payment"
              className="w-full rounded-lg mb-4"
            />
            <p className="text-center text-gray-600">Scan to Pay</p>
            <p className="text-center text-green-600 font-semibold mt-2">
              Safe and Secure [Wait for Confirmation call]
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}