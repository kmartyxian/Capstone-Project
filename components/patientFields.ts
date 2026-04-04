export const personalInfoFields = [
  { name: "firstName", label: "First Name", placeholder: "Enter first name", type: "text" },
  { name: "lastName", label: "Last Name", placeholder: "Enter last name", type: "text" },
  { name: "dateOfBirth", label: "Date of Birth", placeholder: "Enter date of birth", type: "date" },
  { name: "gender", label: "Gender", placeholder: "Enter gender", type: "text" },
  { name: "phoneNumber", label: "Phone Number", placeholder: "Enter phone number", type: "text" },
];

export const addressFields = [
  { name: "street", label: "Street Address", placeholder: "Enter street address", type: "text" },
  { name: "city", label: "City", placeholder: "Enter city", type: "text" },
  { name: "state", label: "State", placeholder: "Enter state", type: "text" },
  { name: "zipCode", label: "Zip Code", placeholder: "Enter zip code", type: "text" },
  { name: "country", label: "Country", placeholder: "Enter country", type: "text" },
];

export const emergencyContactFields = [
  { name: "emergencyContactName", label: "Emergency Contact Name", placeholder: "Enter emergency contact name", type: "text" },
  { name: "emergencyContactPhone", label: "Emergency Contact Phone", placeholder: "Enter emergency contact phone", type: "tel" },
  { name: "emergencyContactRelationship", label: "Relationship", placeholder: "Enter relationship", type: "text" },
];

export const medicalInfoFields = [
  { name: "bloodType", label: "Blood Type", placeholder: "Enter blood type", type: "text" },
  { name: "allergies", label: "Allergies", placeholder: "Enter allergies", type: "text" },
  { name: "currentMedications", label: "Current Medications", placeholder: "Enter current medications", type: "text" },
  { name: "medicalConditions", label: "Medical Conditions", placeholder: "Enter medical conditions", type: "text" },
  { name: "pastSurgeries", label: "Past Surgeries", placeholder: "Enter past surgeries", type: "text" },
];

export const insuranceFields = [
  { name: "insuranceProvider", label: "Insurance Provider", placeholder: "Enter insurance provider", type: "text" },
  { name: "policyNumber", label: "Policy Number", placeholder: "Enter policy number", type: "text" },
  { name: "groupNumber", label: "Group Number", placeholder: "Enter group number", type: "text" },
];

export const appointmentFields = [
  { name: "preferredDate", label: "Preferred Date", placeholder: "Enter preferred date", type: "date" },
  { name: "preferredTime", label: "Preferred Time", placeholder: "Enter preferred time", type: "time" },
  { name: "reasonForVisit", label: "Reason for Visit", placeholder: "Enter reason for visit", type: "text" },
];

export const travelInfoFields = [
  { name: "passportNumber", label: "Passport Number", placeholder: "Enter passport number", type: "text" },
  { name: "nationality", label: "Nationality", placeholder: "Enter nationality", type: "text" },
  { name: "arrivalDate", label: "Arrival Date", placeholder: "Enter arrival date", type: "date" },
  { name: "departureDate", label: "Departure Date", placeholder: "Enter departure date", type: "date" },
  { name: "hotelPreference", label: "Hotel Preference", placeholder: "Enter hotel preference", type: "text" },
];

export const paymentFields = [
  { name: "cardholderName", label: "Cardholder Name", placeholder: "Enter cardholder name", type: "text" },
  { name: "cardNumber", label: "Card Number", placeholder: "Enter card number", type: "text" },
  { name: "expirationDate", label: "Expiration Date", placeholder: "Enter expiration date", type: "month" },
  { name: "cvv", label: "CVV", placeholder: "Enter CVV", type: "text" },
  { name: "billingAddress", label: "Billing Address", placeholder: "Enter billing address", type: "text" },
];

export const loginFields = [
  { name: "email", label: "Email", placeholder: "Enter email", type: "email" },
];


export const patientInfoFields = {
  personalInfoFields,
  addressFields,
  emergencyContactFields,
  medicalInfoFields,
  insuranceFields,
  appointmentFields,
  travelInfoFields,
  paymentFields,
  loginFields
};