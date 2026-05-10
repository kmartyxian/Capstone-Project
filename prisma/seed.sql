INSERT OR IGNORE INTO Provider (id, name, location, createdAt)
VALUES ('provider_demo', 'provider@example.com', 'Chicago, IL', datetime('now'));

INSERT OR IGNORE INTO Patient (
  id,
  firstName,
  lastName,
  phoneNumber,
  email,
  status,
  reasonForVisit,
  createdAt,
  updatedAt
)
VALUES (
  'patient_demo',
  'Test',
  'Patient',
  '5551234567',
  'patient@example.com',
  'Active',
  'Consultation',
  datetime('now'),
  datetime('now')
);
