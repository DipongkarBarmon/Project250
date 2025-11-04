-- Insert sample hospitals
INSERT INTO hospitals (name, address, city, phone, specialties, rating, availability_status) VALUES
  ('City General Hospital', '123 Main St', 'New York', '212-555-0100', ARRAY['Cardiology', 'Neurology', 'Pediatrics'], 4.8, 'open'),
  ('Central Medical Center', '456 Oak Ave', 'New York', '212-555-0200', ARRAY['Orthopedics', 'Surgery', 'Emergency'], 4.6, 'open'),
  ('Riverside Healthcare', '789 River Rd', 'New York', '212-555-0300', ARRAY['Oncology', 'Radiology', 'Dermatology'], 4.7, 'open'),
  ('Downtown Clinic', '321 Downtown Dr', 'New York', '212-555-0400', ARRAY['General Practice', 'Dentistry', 'Ophthalmology'], 4.5, 'open');

-- Insert sample medicines
INSERT INTO medicines (name, category, price, stock, description, manufacturer, dosage) VALUES
  ('Aspirin', 'Pain Relief', 5.99, 500, 'Effective pain reliever', 'Pharma Corp', '100mg'),
  ('Ibuprofen', 'Pain Relief', 7.99, 450, 'Anti-inflammatory medication', 'Health Plus', '200mg'),
  ('Amoxicillin', 'Antibiotics', 12.99, 300, 'Antibiotic for infections', 'Medical Labs', '250mg'),
  ('Vitamin C', 'Vitamins', 8.99, 800, 'Immune system booster', 'Nature Health', '500mg'),
  ('Metformin', 'Diabetes', 15.99, 200, 'Diabetes management', 'Endo Care', '500mg'),
  ('Cetirizine', 'Allergy', 6.99, 600, 'Allergy relief', 'Relief Plus', '10mg'),
  ('Omeprazole', 'Digestive', 11.99, 250, 'Acid reflux treatment', 'Digest Med', '20mg'),
  ('Probiotic', 'Digestive', 14.99, 350, 'Gut health support', 'Bio Health', 'N/A');
