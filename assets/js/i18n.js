(function () {
  var KEY = 'viksha-lang';
  var originals = [];
  var attrOriginals = [];
  var phrases = {
    Home: 'ಮುಖಪುಟ',
    About: 'ನಮ್ಮ ಬಗ್ಗೆ',
    Services: 'ಸೇವೆಗಳು',
    Conditions: 'ತೊಂದರೆಗಳು',
    Blog: 'ಬ್ಲಾಗ್',
    Contact: 'ಸಂಪರ್ಕ',
    Locations: 'ಸ್ಥಳಗಳು',
    Privacy: 'ಗೌಪ್ಯತೆ',
    'Privacy policy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
    'privacy policy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
    'Book Appointment': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ',
    'View Services': 'ಸೇವೆಗಳು ನೋಡಿ',
    'Learn more →': 'ಇನ್ನಷ್ಟು →',
    'Open page →': 'ಪುಟ ತೆರೆಯಿರಿ →',
    'Read article →': 'ಲೇಖನ ಓದಿ →',
    'JP Nagar clinic': 'ಜೆ ಪಿ ನಗರ ಕ್ಲಿನಿಕ್',
    'RR Nagar clinic': 'ಆರ್ ಆರ್ ನಗರ ಕ್ಲಿನಿಕ್',
    'Orthopedic Surgeon · Bengaluru': 'ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ · ಬೆಂಗಳೂರು',
    'Orthopedic Doctor in JP Nagar & RR Nagar': 'ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಮೂಳೆ ವೈದ್ಯರು',
    'Trusted Orthopedic Care. Expert Hands. Better Mobility.': 'ನಂಬಿಕಸ್ಥ ಮೂಳೆ ಚಿಕಿತ್ಸೆ. ನುರಿತ ಕೈಗಳು. ಉತ್ತಮ ಚಲನೆ.',
    'Dr. Chethan Kumar – Consultant Orthopedic, Joint Replacement, Sports Injury & Trauma Specialist in JP Nagar and RR Nagar, Bengaluru.': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ – ಬೆಂಗಳೂರಿನ ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಕನ್ಸಲ್ಟಂಟ್ ಆರ್ಥೊಪೀಡಿಕ್, ಕೀಲು ಬದಲಾವಣೆ, ಕ್ರೀಡಾ ಗಾಯ ಮತ್ತು ಟ್ರಾಮಾ ತಜ್ಞರು.',
    'About the doctor': 'ವೈದ್ಯರ ಬಗ್ಗೆ',
    'Patient trust': 'ರೋಗಿಗಳ ನಂಬಿಕೆ',
    'Mobility stories': 'ಚಲನೆಯ ಕಥೆಗಳು',
    'Mobility story': 'ಚಲನೆಯ ಕಥೆ',
    Appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
    FAQ: 'ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು',
    FAQs: 'ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು',
    Symptoms: 'ಲಕ್ಷಣಗಳು',
    Causes: 'ಕಾರಣಗಳು',
    Diagnosis: 'ರೋಗನಿರ್ಣಯ',
    'Treatment options': 'ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳು',
    'Recovery timeline': 'ಚೇತರಿಕೆಯ ಅವಧಿ',
    'Related conditions': 'ಸಂಬಂಧಿತ ತೊಂದರೆಗಳು',
    'Quick links': 'ತ್ವರಿತ ಕೊಂಡಿಗಳು',
    Links: 'ಕೊಂಡಿಗಳು',
    Clinics: 'ಕ್ಲಿನಿಕ್‌ಗಳು',
    'Back to home': 'ಮುಖಪುಟಕ್ಕೆ',
    'Full name': 'ಪೂರ್ಣ ಹೆಸರು',
    Phone: 'ದೂರವಾಣಿ',
    'Phone:': 'ದೂರವಾಣಿ:',
    Email: 'ಇಮೇಲ್',
    'Email:': 'ಇಮೇಲ್:',
    Message: 'ಸಂದೇಶ',
    'Preferred clinic': 'ಆದ್ಯತೆಯ ಕ್ಲಿನಿಕ್',
    'Preferred date': 'ಆದ್ಯತೆಯ ದಿನಾಂಕ',
    Service: 'ಸೇವೆ',
    'General consultation': 'ಸಾಮಾನ್ಯ ಸಮಾಲೋಚನೆ',
    'Send via WhatsApp': 'ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಮೂಲಕ ಕಳುಹಿಸಿ',
    'Send a WhatsApp booking': 'ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಬುಕಿಂಗ್',
    Call: 'ಕರೆ',
    'Call clinic': 'ಕ್ಲಿನಿಕ್‌ಗೆ ಕರೆ',
    WhatsApp: 'ವಾಟ್ಸ್‌ಆ್ಯಪ್',
    'WhatsApp:': 'ವಾಟ್ಸ್‌ಆ್ಯಪ್:',
    'Chat now': 'ಈಗ ಚಾಟ್ ಮಾಡಿ',
    'Book an appointment': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ',
    'Meet Dr. Chethan Kumar': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ ಅವರನ್ನು ಭೇಟಿ ಮಾಡಿ',
    'About Dr. Chethan Kumar': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ ಅವರ ಬಗ್ಗೆ',
    'Areas of expertise': 'ಪರಿಣತಿಯ ಕ್ಷೇತ್ರಗಳು',
    'Personal branding': 'ವೈಯಕ್ತಿಕ ಪರಿಚಯ',
    'Insurance and TPA': 'ವಿಮೆ ಮತ್ತು ಟಿಪಿಎ',
    'Knee Replacement': 'ಮೊಣಕಾಲು ಬದಲಾವಣೆ',
    'Hip Replacement': 'ಸೊಂಟ ಬದಲಾವಣೆ',
    Arthroscopy: 'ಆರ್ತ್ರೋಸ್ಕೋಪಿ',
    'Sports Injury Treatment': 'ಕ್ರೀಡಾ ಗಾಯ ಚಿಕಿತ್ಸೆ',
    'Sports Injury': 'ಕ್ರೀಡಾ ಗಾಯ',
    'Shoulder & Rotator Cuff': 'ಭುಜ ಮತ್ತು ರೊಟೇಟರ್ ಕಫ್',
    'ACL / Meniscus Injury': 'ಎಸಿಎಲ್ / ಮೆನಿಸ್ಕಸ್ ಗಾಯ',
    'Fracture & Trauma Surgery': 'ಮುರಿತ ಮತ್ತು ಟ್ರಾಮಾ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    'Fracture & Trauma': 'ಮುರಿತ ಮತ್ತು ಟ್ರಾಮಾ',
    'Fracture / Trauma': 'ಮುರಿತ / ಟ್ರಾಮಾ',
    'Back Pain & Slip Disc': 'ಬೆನ್ನು ನೋವು ಮತ್ತು ಸ್ಲಿಪ್ ಡಿಸ್ಕ್',
    'Back Pain & Slip Disc Treatment': 'ಬೆನ್ನು ನೋವು ಮತ್ತು ಸ್ಲಿಪ್ ಡಿಸ್ಕ್ ಚಿಕಿತ್ಸೆ',
    'Neck Pain & Cervical Spondylosis': 'ಕತ್ತಿನ ನೋವು ಮತ್ತು ಸರ್ವೈಕಲ್ ಸ್ಪಾಂಡಿಲೋಸಿಸ್',
    'Neck Pain': 'ಕತ್ತಿನ ನೋವು',
    'Arthritis Treatment': 'ಸಂಧಿವಾತ ಚಿಕಿತ್ಸೆ',
    Arthritis: 'ಸಂಧಿವಾತ',
    'Pediatric Orthopedics': 'ಮಕ್ಕಳ ಮೂಳೆ ಚಿಕಿತ್ಸೆ',
    'Osteoporosis & Bone Health': 'ಆಸ್ಟಿಯೊಪೊರೋಸಿಸ್ ಮತ್ತು ಮೂಳೆ ಆರೋಗ್ಯ',
    Osteoporosis: 'ಆಸ್ಟಿಯೊಪೊರೋಸಿಸ್',
    'Trauma Surgery': 'ಟ್ರಾಮಾ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    'Knee Pain': 'ಮೊಣಕಾಲು ನೋವು',
    'Knee pain': 'ಮೊಣಕಾಲು ನೋವು',
    'Hip Pain': 'ಸೊಂಟದ ನೋವು',
    'Hip pain': 'ಸೊಂಟದ ನೋವು',
    'Shoulder Pain': 'ಭುಜದ ನೋವು',
    'Shoulder pain': 'ಭುಜದ ನೋವು',
    'Frozen Shoulder': 'ಫ್ರೋಜನ್ ಶೋಲ್ಡರ್',
    'Frozen shoulder': 'ಫ್ರೋಜನ್ ಶೋಲ್ಡರ್',
    'Tennis Elbow': 'ಟೆನಿಸ್ ಎಲ್ಬೋ',
    'Heel Pain': 'ಹಿಮ್ಮಡಿ ನೋವು',
    'Plantar Fasciitis': 'ಪ್ಲಾಂಟಾರ್ ಫ್ಯಾಸಿಯೈಟಿಸ್',
    'Ankle Ligament Injury': 'ಕಣಕಾಲು ನಾರು ಗಾಯ',
    'Wrist Pain': 'ಮಣಿಕಟ್ಟು ನೋವು',
    'Carpal Tunnel Syndrome': 'ಕಾರ್ಪಲ್ ಟನಲ್ ಸಿಂಡ್ರೋಮ್',
    Osteoarthritis: 'ಆಸ್ಟಿಯೋಆರ್ಥ್ರೈಟಿಸ್',
    'Rheumatoid Arthritis': 'ರುಮಟಾಯ್ಡ್ ಆರ್ಥ್ರೈಟಿಸ್',
    Sciatica: 'ಸಯಾಟಿಕಾ',
    'Cervical Radiculopathy': 'ಸರ್ವೈಕಲ್ ರೇಡಿಕ್ಯುಲೋಪತಿ',
    'Disc Prolapse': 'ಡಿಸ್ಕ್ ಪ್ರೊಲ್ಯಾಪ್ಸ್',
    'Bone Fractures': 'ಮೂಳೆ ಮುರಿತಗಳು',
    'Ligament Injuries': 'ನಾರು ಗಾಯಗಳು',
    'Conditions treated': 'ಚಿಕಿತ್ಸಿಸುವ ತೊಂದರೆಗಳು',
    'Orthopedic services': 'ಮೂಳೆ ಸೇವೆಗಳು',
    'Patient education blog': 'ರೋಗಿ ಶಿಕ್ಷಣ ಬ್ಲಾಗ್',
    'Orthopedic clinic in JP Nagar': 'ಜೆ ಪಿ ನಗರದಲ್ಲಿ ಮೂಳೆ ಕ್ಲಿನಿಕ್',
    'Orthopedic clinic in RR Nagar': 'ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಮೂಳೆ ಕ್ಲಿನಿಕ್',
    'Page not found': 'ಪುಟ ಸಿಗಲಿಲ್ಲ',
    'The page you requested is missing. Return home or book an appointment.': 'ನೀವು ಕೇಳಿದ ಪುಟ ಸಿಗಲಿಲ್ಲ. ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ ಅಥವಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ.',
    'Need personal advice?': 'ವೈಯಕ್ತಿಕ ಸಲಹೆ ಬೇಕೇ?',
    'Discuss this with Dr. Chethan Kumar': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ ಅವರೊಂದಿಗೆ ಚರ್ಚಿಸಿ',
    'Consult in JP Nagar or RR Nagar': 'ಜೆ ಪಿ ನಗರ ಅಥವಾ ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಸಮಾಲೋಚನೆ',
    'Book a consultation in JP Nagar or RR Nagar': 'ಜೆ ಪಿ ನಗರ ಅಥವಾ ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಸಮಾಲೋಚನೆ ಕಾಯ್ದಿರಿಸಿ',
    'Questions patients search before visiting': 'ಭೇಟಿಗೆ ಮುನ್ನ ರೋಗಿಗಳು ಹುಡುಕುವ ಪ್ರಶ್ನೆಗಳು',
    'Fellowship-trained. Compassionate. Focused on mobility.': 'ಫೆಲೋಶಿಪ್ ಪಡೆದ. ಸಹಾನುಭೂತಿ. ಚಲನೆಗೆ ಗಮನ.',
    'Fellowship-trained orthopedic surgeon in Bengaluru South': 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣದಲ್ಲಿ ಫೆಲೋಶಿಪ್ ಪಡೆದ ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ',
    'Joint replacement': 'ಕೀಲು ಬದಲಾವಣೆ',
    'Sports & arthroscopy': 'ಕ್ರೀಡೆ ಮತ್ತು ಆರ್ತ್ರೋಸ್ಕೋಪಿ',
    'Trauma care': 'ಟ್ರಾಮಾ ಆರೈಕೆ',
    'Spine & shoulder': 'ಬೆನ್ನು ಮತ್ತು ಭುಜ',
    'Hip & knee replacement': 'ಸೊಂಟ ಮತ್ತು ಮೊಣಕಾಲು ಬದಲಾವಣೆ',
    'Sports injuries': 'ಕ್ರೀಡಾ ಗಾಯಗಳು',
    'Trauma & fractures': 'ಟ್ರಾಮಾ ಮತ್ತು ಮುರಿತಗಳು',
    'Bone health': 'ಮೂಳೆ ಆರೋಗ್ಯ',
    'Walking without a stick': 'ಕೋಲು ಇಲ್ಲದೆ ನಡೆಯುವುದು',
    'Back to desk work': 'ಕಚೇರಿ ಕೆಲಸಕ್ಕೆ ಹಿಂತಿರುಗುವುದು',
    'Return to walking trails': 'ನಡಿಗೆಗೆ ಹಿಂತಿರುಗುವುದು',
    'Clinics in Bengaluru South': 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣದಲ್ಲಿ ಕ್ಲಿನಿಕ್‌ಗಳು',
    'Early Signs of Knee Arthritis': 'ಮೊಣಕಾಲು ಸಂಧಿವಾತದ ಆರಂಭಿಕ ಲಕ್ಷಣಗಳು',
    'When Do You Need Knee Replacement?': 'ಮೊಣಕಾಲು ಬದಲಾವಣೆ ಯಾವಾಗ ಬೇಕು?',
    'Best Exercises for Back Pain': 'ಬೆನ್ನು ನೋವಿಗೆ ಉತ್ತಮ ವ್ಯಾಯಾಮಗಳು',
    'Sports Injury Prevention': 'ಕ್ರೀಡಾ ಗಾಯ ತಡೆಗಟ್ಟುವಿಕೆ',
    'Hip Replacement Recovery Guide': 'ಸೊಂಟ ಬದಲಾವಣೆ ಚೇತರಿಕೆ ಮಾರ್ಗದರ್ಶಿ',
    'Frozen Shoulder Treatment': 'ಫ್ರೋಜನ್ ಶೋಲ್ಡರ್ ಚಿಕಿತ್ಸೆ',
    'Knee Replacement in JP Nagar, Bengaluru': 'ಜೆ ಪಿ ನಗರ, ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮೊಣಕಾಲು ಬದಲಾವಣೆ',
    'Hip Replacement in RR Nagar & Bengaluru South': 'ಆರ್ ಆರ್ ನಗರ ಮತ್ತು ಬೆಂಗಳೂರು ದಕ್ಷಿಣದಲ್ಲಿ ಸೊಂಟ ಬದಲಾವಣೆ',
    'Arthroscopy (Keyhole Joint Surgery)': 'ಆರ್ತ್ರೋಸ್ಕೋಪಿ (ಕೀಹೋಲ್ ಕೀಲು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ)',
    'Sports Injury Treatment in JP Nagar': 'ಜೆ ಪಿ ನಗರದಲ್ಲಿ ಕ್ರೀಡಾ ಗಾಯ ಚಿಕಿತ್ಸೆ',
    'Shoulder Pain & Rotator Cuff Care': 'ಭುಜದ ನೋವು ಮತ್ತು ರೊಟೇಟರ್ ಕಫ್ ಆರೈಕೆ',
    'ACL / Meniscus Injury Treatment': 'ಎಸಿಎಲ್ / ಮೆನಿಸ್ಕಸ್ ಗಾಯ ಚಿಕಿತ್ಸೆ',
    'See our': 'ನೋಡಿ',
    'By submitting, you agree to our': 'ಸಲ್ಲಿಸುವ ಮೂಲಕ ನೀವು ಒಪ್ಪುತ್ತೀರಿ',
    'This is not an emergency service.': 'ಇದು ತುರ್ತು ಸೇವೆ ಅಲ್ಲ.',
    'Describe your symptoms briefly': 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಬರೆಯಿರಿ',
    'Philosophy:': 'ತತ್ವ:',
    'Qualifications (to be confirmed by the clinic):': 'ಅರ್ಹತೆಗಳು (ಕ್ಲಿನಿಕ್ ದೃಢಪಡಿಸಬೇಕು):',
    'Hospital affiliations (placeholder):': 'ಆಸ್ಪತ್ರೆ ಸಂಬಂಧ (ತಾತ್ಕಾಲಿಕ):',
    'Spine / Back Pain': 'ಬೆನ್ನು ನೋವು',
    Shoulder: 'ಭುಜ',
    'JP Nagar': 'ಜೆ ಪಿ ನಗರ',
    'RR Nagar': 'ಆರ್ ಆರ್ ನಗರ',
    'Also see the': 'ಇದನ್ನೂ ನೋಡಿ',
    'appointment form': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಫಾರ್ಮ್',
    'Skip to main content': 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
    'Open menu': 'ಮೆನು ತೆರೆಯಿರಿ',
    'Close menu': 'ಮೆನು ಮುಚ್ಚಿ',
    'Switch language': 'ಭಾಷೆ ಬದಲಿಸಿ',
    'Chat on WhatsApp': 'ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಚಾಟ್',
    'Book on WhatsApp': 'ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಕಾಯ್ದಿರಿಸಿ',
    Primary: 'ಮುಖ್ಯ',
    Breadcrumb: 'ಬ್ರೆಡ್‌ಕ್ರಂಬ್',
    'knee replacement': 'ಮೊಣಕಾಲು ಬದಲಾವಣೆ',
    'hip replacement': 'ಸೊಂಟ ಬದಲಾವಣೆ',
    'arthritis treatment': 'ಸಂಧಿವಾತ ಚಿಕಿತ್ಸೆ',
    'neck pain': 'ಕತ್ತಿನ ನೋವು',
    'plantar fasciitis': 'ಪ್ಲಾಂಟಾರ್ ಫ್ಯಾಸಿಯೈಟಿಸ್',
    'rotator cuff care': 'ರೊಟೇಟರ್ ಕಫ್ ಆರೈಕೆ',
    'slip disc care': 'ಸ್ಲಿಪ್ ಡಿಸ್ಕ್ ಆರೈಕೆ',
    'ACL/meniscus': 'ಎಸಿಎಲ್/ಮೆನಿಸ್ಕಸ್',
    'All rights reserved.': 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    'Dr. Chethan Kumar. All rights reserved.': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    'Dr. Chethan Kumar · Orthopedic Surgeon – JP Nagar & RR Nagar': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ · ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ – ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರ',
    'Consultant Orthopedic Surgeon — JP Nagar & RR Nagar, Bengaluru. Patient-first, evidence-based orthopedic care.': 'ಕನ್ಸಲ್ಟಂಟ್ ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ — ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರ, ಬೆಂಗಳೂರು. ರೋಗಿ-ಮೊದಲ, ಸಾಕ್ಷ್ಯಾಧಾರಿತ ಮೂಳೆ ಚಿಕಿತ್ಸೆ.',
    'Consultant Orthopedic Surgeon — JP Nagar & RR Nagar, Bengaluru. Joint replacement, sports injury, trauma and fracture care for Bengaluru South.': 'ಕನ್ಸಲ್ಟಂಟ್ ಮೂಳೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ — ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರ, ಬೆಂಗಳೂರು. ಬೆಂಗಳೂರು ದಕ್ಷಿಣಕ್ಕೆ ಕೀಲು ಬದಲಾವಣೆ, ಕ್ರೀಡಾ ಗಾಯ, ಟ್ರಾಮಾ ಮತ್ತು ಮುರಿತ ಆರೈಕೆ.',
    'Orthopedic consultations in JP Nagar and RR Nagar. WhatsApp booking, phone and maps.': 'ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಮೂಳೆ ಸಮಾಲೋಚನೆ. ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಬುಕಿಂಗ್, ದೂರವಾಣಿ ಮತ್ತು ನಕ್ಷೆಗಳು.',
    'Orthopedic care for JP Nagar, RR Nagar & South Bengaluru': 'ಜೆ ಪಿ ನಗರ, ಆರ್ ಆರ್ ನಗರ ಮತ್ತು ದಕ್ಷಿಣ ಬೆಂಗಳೂರಿಗೆ ಮೂಳೆ ಆರೈಕೆ',
    'Pain, injury and arthritis — assessed locally': 'ನೋವು, ಗಾಯ ಮತ್ತು ಸಂಧಿವಾತ — ಸ್ಥಳೀಯವಾಗಿ ಮೌಲ್ಯಮಾಪನ',
    'Clinics in JP Nagar and RR Nagar. Book by WhatsApp.': 'ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಕ್ಲಿನಿಕ್‌ಗಳು. ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಕಾಯ್ದಿರಿಸಿ.',
    'Educational information only. Not medical advice. Individual results vary. Emergencies: nearest hospital.': 'ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ ಮಾತ್ರ. ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ. ಫಲಿತಾಂಶಗಳು ವ್ಯಕ್ತಿಗನುಗುಣವಾಗಿ ಬದಲಾಗುತ್ತವೆ. ತುರ್ತು: ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ.',
    'Educational only. Not a substitute for consultation.': 'ಶೈಕ್ಷಣಿಕ ಮಾತ್ರ. ಸಮಾಲೋಚನೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    'Educational only. Emergencies: nearest hospital ER.': 'ಶೈಕ್ಷಣಿಕ ಮಾತ್ರ. ತುರ್ತು: ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಇಆರ್.',
    'Educational content only. Not a substitute for consultation. Emergency: nearest hospital.': 'ಶೈಕ್ಷಣಿಕ ವಿಷಯ ಮಾತ್ರ. ಸಮಾಲೋಚನೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ತುರ್ತು: ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ.',
    'Not for emergencies. Visit the nearest hospital ER if you have an open fracture, loss of consciousness, or sudden inability to walk.': 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಲ್ಲ. ಮುಕ್ತ ಮುರಿತ, ಪ್ರಜ್ಞೆ ಕಳೆದುಕೊಳ್ಳುವುದು ಅಥವಾ ನಡೆಯಲಾಗದಿದ್ದರೆ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಇಆರ್‌ಗೆ ಹೋಗಿ.',
    'Medical disclaimer: Information on this website is for education only and is not a substitute for professional medical advice, diagnosis or treatment. Individual outcomes vary. In an emergency, call local emergency services or visit the nearest hospital.': 'ವೈದ್ಯಕೀಯ ಹಕ್ಕುತ್ಯಾಗ: ಈ ತಾಣದ ಮಾಹಿತಿ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಮಾತ್ರ; ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ಚಿಕಿತ್ಸೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ಫಲಿತಾಂಶಗಳು ಬದಲಾಗುತ್ತವೆ. ತುರ್ತಿನಲ್ಲಿ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ.',
    'Dedicated pages for procedures and treatments offered at JP Nagar and RR Nagar clinics.': 'ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರ ಕ್ಲಿನಿಕ್‌ಗಳಲ್ಲಿ ನೀಡುವ ಚಿಕಿತ್ಸೆಗಳ ಪುಟಗಳು.',
    'Guides written for searches patients actually make before visiting an orthopedic doctor in JP Nagar or RR Nagar.': 'ಜೆ ಪಿ ನಗರ ಅಥವಾ ಆರ್ ಆರ್ ನಗರದ ಮೂಳೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡುವ ಮುನ್ನ ರೋಗಿಗಳು ಹುಡುಕುವ ಮಾರ್ಗದರ್ಶಿಗಳು.',
    'Dr. Chethan Kumar consults in JP Nagar for joint replacement, sports injuries and trauma. Address below is a placeholder until the clinic confirms the exact pin.': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ ಜೆ ಪಿ ನಗರದಲ್ಲಿ ಕೀಲು ಬದಲಾವಣೆ, ಕ್ರೀಡಾ ಗಾಯ ಮತ್ತು ಟ್ರಾಮಾಗೆ ಸಮಾಲೋಚನೆ ನೀಡುತ್ತಾರೆ. ಕೆಳಗಿನ ವಿಳಾಸ ಕ್ಲಿನಿಕ್ ದೃಢಪಡಿಸುವವರೆಗೆ ತಾತ್ಕಾಲಿಕ.',
    'Dr. Chethan Kumar consults in RR Nagar for joint replacement, sports injuries and trauma. Address below is a placeholder until the clinic confirms the exact pin.': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಕೀಲು ಬದಲಾವಣೆ, ಕ್ರೀಡಾ ಗಾಯ ಮತ್ತು ಟ್ರಾಮಾಗೆ ಸಮಾಲೋಚನೆ ನೀಡುತ್ತಾರೆ. ಕೆಳಗಿನ ವಿಳಾಸ ಕ್ಲಿನಿಕ್ ದೃಢಪಡಿಸುವವರೆಗೆ ತಾತ್ಕಾಲಿಕ.',
    'Dr. Chethan Kumar · JP Nagar & RR Nagar': 'ಡಾ. ಚೇತನ್ ಕುಮಾರ್ · ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರ',
    'SEO hub for common orthopedic problems. Jump to a condition or book a visit in JP Nagar or RR Nagar.': 'ಸಾಮಾನ್ಯ ಮೂಳೆ ತೊಂದರೆಗಳ ಕೇಂದ್ರ. ತೊಂದರೆ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಜೆ ಪಿ ನಗರ / ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಭೇಟಿ ಕಾಯ್ದಿರಿಸಿ.',
    'Articles on arthritis, replacement surgery, back pain and sports injury — written for patients in JP Nagar and RR Nagar.': 'ಸಂಧಿವಾತ, ಬದಲಾವಣೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಬೆನ್ನು ನೋವು ಮತ್ತು ಕ್ರೀಡಾ ಗಾಯ — ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದ ರೋಗಿಗಳಿಗೆ.',
    'Same doctor, two convenient clinics in South Bengaluru. Book by WhatsApp or phone.': 'ಅದೇ ವೈದ್ಯರು, ದಕ್ಷಿಣ ಬೆಂಗಳೂರಿನಲ್ಲಿ ಎರಡು ಅನುಕೂಲಕರ ಕ್ಲಿನಿಕ್‌ಗಳು. ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಅಥವಾ ದೂರವಾಣಿಯಲ್ಲಿ ಕಾಯ್ದಿರಿಸಿ.',
    'Convenient for Banashankari, Jayanagar and Kanakapura Road.': 'ಬನಶಂಕರಿ, ಜಯನಗರ ಮತ್ತು ಕನಕಪುರ ರಸ್ತೆಗೆ ಅನುಕೂಲ.',
    'Convenient for Uttarahalli and west of Kanakapura Road.': 'ಉತ್ತರಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರ ರಸ್ತೆಯ ಪಶ್ಚಿಮಕ್ಕೆ ಅನುಕೂಲ.',
    'JP Nagar · RR Nagar · Banashankari · Jayanagar': 'ಜೆ ಪಿ ನಗರ · ಆರ್ ಆರ್ ನಗರ · ಬನಶಂಕರಿ · ಜಯನಗರ',
    'JP Nagar · RR Nagar · Bengaluru South': 'ಜೆ ಪಿ ನಗರ · ಆರ್ ಆರ್ ನಗರ · ಬೆಂಗಳೂರು ದಕ್ಷಿಣ',
    'The form opens WhatsApp with your details. Clinic addresses below are placeholders until you share the exact pins.': 'ಫಾರ್ಮ್ ನಿಮ್ಮ ವಿವರಗಳೊಂದಿಗೆ ವಾಟ್ಸ್‌ಆ್ಯಪ್ ತೆರೆಯುತ್ತದೆ. ಕೆಳಗಿನ ವಿಳಾಸಗಳು ನಿಖರ ಪಿನ್ ಬರುವವರೆಗೆ ತಾತ್ಕಾಲಿಕ.',
    'Who is a good orthopedic doctor in JP Nagar?': 'ಜೆ ಪಿ ನಗರದಲ್ಲಿ ಒಳ್ಳೆಯ ಮೂಳೆ ವೈದ್ಯರು ಯಾರು?',
    'Is there an orthopedic specialist in RR Nagar?': 'ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಮೂಳೆ ತಜ್ಞರಿದ್ದಾರೆಯೇ?',
    'When do I need a knee replacement surgeon in JP Nagar, Bengaluru?': 'ಬೆಂಗಳೂರಿನ ಜೆ ಪಿ ನಗರದಲ್ಲಿ ಮೊಣಕಾಲು ಬದಲಾವಣೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸಕ ಯಾವಾಗ ಬೇಕು?',
    'Who does hip replacement near RR Nagar?': 'ಆರ್ ಆರ್ ನಗರದ ಬಳಿ ಸೊಂಟ ಬದಲಾವಣೆ ಯಾರು ಮಾಡುತ್ತಾರೆ?',
    'Can a sports injury doctor in JP Nagar treat ACL tears?': 'ಜೆ ಪಿ ನಗರದ ಕ್ರೀಡಾ ಗಾಯ ವೈದ್ಯರು ಎಸಿಎಲ್ ಕಣ್ಣೀರು ಚಿಕಿತ್ಸೆ ಮಾಡುತ್ತಾರೆಯೇ?',
    'Do you treat trauma and fractures in RR Nagar?': 'ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಟ್ರಾಮಾ ಮತ್ತು ಮುರಿತ ಚಿಕಿತ್ಸೆ ಇದೆಯೇ?',
    'What does a joint pain specialist in Bengaluru South treat?': 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣದ ಕೀಲು ನೋವು ತಜ್ಞರು ಏನು ಚಿಕಿತ್ಸೆ ಮಾಡುತ್ತಾರೆ?',
    'How do I book an orthopedic appointment?': 'ಮೂಳೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಹೇಗೆ ಕಾಯ್ದಿರಿಸುವುದು?',
    'Do I need an MRI before the first visit?': 'ಮೊದಲ ಭೇಟಿಗೆ ಮುನ್ನ ಎಂಆರ್‌ಐ ಬೇಕೇ?',
    'Is orthopedic treatment only surgery?': 'ಮೂಳೆ ಚಿಕಿತ್ಸೆ ಕೇವಲ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯೇ?',
    'Can Banashankari and Jayanagar patients visit JP Nagar clinic?': 'ಬನಶಂಕರಿ ಮತ್ತು ಜಯನಗರದ ರೋಗಿಗಳು ಜೆ ಪಿ ನಗರ ಕ್ಲಿನಿಕ್‌ಗೆ ಬರಬಹುದೇ?',
    'Is Uttarahalli and Kanakapura Road covered?': 'ಉತ್ತರಹಳ್ಳಿ ಮತ್ತು ಕನಕಪುರ ರಸ್ತೆ ಒಳಗೊಂಡಿದೆಯೇ?',
    'What are typical clinic timings?': 'ಸಾಮಾನ್ಯ ಕ್ಲಿನಿಕ್ ಸಮಯಗಳೇನು?',
    'Do you treat frozen shoulder and tennis elbow?': 'ಫ್ರೋಜನ್ ಶೋಲ್ಡರ್ ಮತ್ತು ಟೆನಿಸ್ ಎಲ್ಬೋ ಚಿಕಿತ್ಸೆ ಇದೆಯೇ?',
    'Can children be seen for fractures?': 'ಮಕ್ಕಳ ಮುರಿತಗಳಿಗೆ ನೋಡಲಾಗುತ್ತದೆಯೇ?',
    'How long is recovery after knee replacement?': 'ಮೊಣಕಾಲು ಬದಲಾವಣೆಯ ನಂತರ ಚೇತರಿಕೆ ಎಷ್ಟು ಕಾಲ?',
    'Is this website medical advice?': 'ಈ ತಾಣ ವೈದ್ಯಕೀಯ ಸಲಹೆಯೇ?',
    'Do you accept insurance?': 'ವಿಮೆ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?',
    'How do I reach the clinic by road?': 'ರಸ್ತೆಯ ಮೂಲಕ ಕ್ಲಿನಿಕ್‌ಗೆ ಹೇಗೆ ಬರುವುದು?',
    'Can I message on WhatsApp instead of calling?': 'ಕರೆ ಬದಲು ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಬಹುದೇ?',
    'Should every woman get a DEXA?': 'ಪ್ರತಿ ಮಹಿಳೆಗೂ ಡೆಕ್ಸಾ ಬೇಕೇ?',
    'Does osteoporosis always cause pain?': 'ಆಸ್ಟಿಯೊಪೊರೋಸಿಸ್ ಯಾವಾಗಲೂ ನೋವುಂಟುಮಾಡುತ್ತದೆಯೇ?',
    'Is hip replacement only for the elderly?': 'ಸೊಂಟ ಬದಲಾವಣೆ ಕೇವಲ ವೃದ್ಧರಿಗೇ?',
    'How long do implants last?': 'ಇಂಪ್ಲಾಂಟ್‌ಗಳು ಎಷ್ಟು ಕಾಲ ಇರುತ್ತವೆ?',
    'Is arthritis only in the elderly?': 'ಸಂಧಿವಾತ ಕೇವಲ ವೃದ್ಧರಲ್ಲಿ ಮಾತ್ರವೇ?',
    'Can diet cure arthritis?': 'ಆಹಾರದಿಂದ ಸಂಧಿವಾತ ಗುಣವಾಗುತ್ತದೆಯೇ?',
    'When is knee replacement needed?': 'ಮೊಣಕಾಲು ಬದಲಾವಣೆ ಯಾವಾಗ ಬೇಕು?',
    'Can I avoid surgery?': 'ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ತಪ್ಪಿಸಬಹುದೇ?',
    'Can ACL heal without surgery?': 'ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಇಲ್ಲದೆ ಎಸಿಎಲ್ ಗುಣವಾಗುತ್ತದೆಯೇ?',
    'Is meniscus always trimmed?': 'ಮೆನಿಸ್ಕಸ್ ಯಾವಾಗಲೂ ಕತ್ತರಿಸಲಾಗುತ್ತದೆಯೇ?',
    'Should I go to ER or the clinic?': 'ಇಆರ್‌ಗೆ ಹೋಗಬೇಕೇ ಅಥವಾ ಕ್ಲಿನಿಕ್‌ಗೆ?',
    'Do all fractures need surgery?': 'ಎಲ್ಲ ಮುರಿತಗಳಿಗೂ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಬೇಕೇ?',
    'Does a slip disc always need surgery?': 'ಸ್ಲಿಪ್ ಡಿಸ್ಕ್‌ಗೆ ಯಾವಾಗಲೂ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಬೇಕೇ?',
    'What is sciatica?': 'ಸಯಾಟಿಕಾ ಎಂದರೇನು?',
    'Are growing pains dangerous?': 'ಬೆಳವಣಿಗೆಯ ನೋವು ಅಪಾಯಕಾರಿಯೇ?',
    'Can my child walk in a cast?': 'ನನ್ನ ಮಗು ಪ್ಲಾಸ್ಟರ್‌ನಲ್ಲಿ ನಡೆಯಬಹುದೇ?',
    'Is frozen shoulder the same as rotator cuff tear?': 'ಫ್ರೋಜನ್ ಶೋಲ್ಡರ್ ರೊಟೇಟರ್ ಕಫ್ ಕಣ್ಣೀರಿನಂತೆಯೇ?',
    'Do all cuff tears need surgery?': 'ಎಲ್ಲ ಕಫ್ ಕಣ್ಣೀರಿಗೂ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಬೇಕೇ?',
    'Is arthroscopy always better than open surgery?': 'ಆರ್ತ್ರೋಸ್ಕೋಪಿ ಯಾವಾಗಲೂ ಓಪನ್ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಿಂತ ಉತ್ತಮವೇ?',
    'Will I have scars?': 'ಗಾಯದ ಗುರುತುಗಳು ಉಳಿಯುತ್ತವೆಯೇ?',
    'Can I play through pain?': 'ನೋವಿನಲ್ಲಿಯೂ ಆಟ ಆಡಬಹುದೇ?',
    'Do all sports injuries need MRI?': 'ಎಲ್ಲ ಕ್ರೀಡಾ ಗಾಯಗಳಿಗೂ ಎಂಆರ್‌ಐ ಬೇಕೇ?',
    'Is cervical spondylosis dangerous?': 'ಸರ್ವೈಕಲ್ ಸ್ಪಾಂಡಿಲೋಸಿಸ್ ಅಪಾಯಕಾರಿಯೇ?',
    'Do I need a cervical collar?': 'ಸರ್ವೈಕಲ್ ಕಾಲರ್ ಬೇಕೇ?',
    'Tap for details': 'ವಿವರಗಳಿಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ',
    'Related care →': 'ಸಂಬಂಧಿತ ಚಿಕಿತ್ಸೆ →',
    'Consultations in JP Nagar and RR Nagar, convenient for Banashankari and Jayanagar.': 'ಜೆ ಪಿ ನಗರ ಮತ್ತು ಆರ್ ಆರ್ ನಗರದಲ್ಲಿ ಸಮಾಲೋಚನೆ; ಬನಶಂಕರಿ ಮತ್ತು ಜಯನಗರಕ್ಕೆ ಅನುಕೂಲ.',
    'Common orthopedic problems seen in clinic. Tap a card for a short overview.': 'ಕ್ಲಿನಿಕ್‌ನಲ್ಲಿ ಕಾಣುವ ಸಾಮಾನ್ಯ ಮೂಳೆ ತೊಂದರೆಗಳು. ಸಂಕ್ಷಿಪ್ತ ವಿವರಕ್ಕೆ ಕಾರ್ಡ್ ಟ್ಯಾಪ್ ಮಾಡಿ.'
  };

  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, SVG: 1, NOSCRIPT: 1, CODE: 1 };

  function capture(node) {
    if (node.nodeType === 3) {
      originals.push({ node: node, text: node.nodeValue });
      return;
    }
    if (node.nodeType !== 1 || SKIP[node.tagName]) return;
    if (node.hasAttribute && node.hasAttribute('data-lang-toggle')) return;
    ['placeholder', 'aria-label'].forEach(function (attr) {
      if (node.hasAttribute && node.hasAttribute(attr)) {
        attrOriginals.push({ el: node, attr: attr, text: node.getAttribute(attr) });
      }
    });
    var child = node.firstChild;
    while (child) {
      capture(child);
      child = child.nextSibling;
    }
  }

  function kn(key) {
    return phrases[key] || null;
  }

  function apply(lang) {
    document.documentElement.lang = lang === 'kn' ? 'kn' : 'en';
    originals.forEach(function (item) {
      if (lang !== 'kn') {
        item.node.nodeValue = item.text;
        return;
      }
      var raw = item.text;
      var key = raw.replace(/\s+/g, ' ').trim();
      if (!key || key.length < 2) return;
      if (/^[\d+.\s–-]+$/.test(key) || key.indexOf('@') !== -1) return;
      if (key === 'Dr. Chethan Kumar') return;
      var mapped = kn(key);
      if (mapped) {
        var lead = raw.match(/^\s*/)[0];
        var trail = raw.match(/\s*$/)[0];
        item.node.nodeValue = lead + mapped + trail;
      }
    });
    attrOriginals.forEach(function (item) {
      if (lang !== 'kn') {
        item.el.setAttribute(item.attr, item.text);
        return;
      }
      var mapped = kn(item.text);
      if (mapped) item.el.setAttribute(item.attr, mapped);
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.textContent = lang === 'kn' ? 'English' : 'ಕನ್ನಡ';
      btn.setAttribute('aria-pressed', lang === 'kn' ? 'true' : 'false');
    });
  }

  if (document.body) capture(document.body);
  var toggle = document.querySelector('[data-lang-toggle]');
  var toggleHidden = !toggle || window.getComputedStyle(toggle).display === 'none';
  var lang = toggleHidden ? 'en' : (localStorage.getItem(KEY) || 'en');
  apply(lang);
  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lang = lang === 'kn' ? 'en' : 'kn';
      localStorage.setItem(KEY, lang);
      apply(lang);
    });
  });
})();
