/**
 * Site-wide configuration — update real details here.
 * All pages read from this single source of truth.
 */
const SITE_CONFIG = {
  doctor: {
    name: "Dr. Chethan Kumar",
    title: "Consultant Orthopaedic Surgeon",
    qualifications: "MBBS, MS (Orthopedics), Fellowship in Joint Replacement & Sports Medicine",
    experience: "12+",
    surgeries: "2,000+",
    bio: "Dr. Chethan Kumar is a consultant orthopaedic surgeon serving patients in JP Nagar, RR Nagar, Banashankari, Uttarahalli, Kanakapura Road, Jayanagar and South Bengaluru. He combines surgical expertise with conservative treatment approaches, helping patients understand their condition and explore all appropriate options before making a decision. Patient-first, evidence-based care focused on restoring mobility.",
    photo: "assets/images/doctor/dr-chetan-photo.jpg",
    photoAlt: "Dr. Chethan Kumar - Orthopaedic Surgeon in JP Nagar and RR Nagar, Bengaluru",
    affiliations: [
      { role: "Consultant", name: "Atreum Speciality Hospital, RR Nagar" },
      { role: "Visiting consultant", name: "HAL Hospital, Suranjandas Road, Vimanapura, Bengaluru – 560017" },
      { role: "Visiting consultant", name: "Manipal Hospital, Jayanagar 9th Block" }
    ]
  },

  brand: {
    name: "Viksha Orthopaedic Clinic",
    tagline: "Trusted Orthopaedic Care. Expert Hands. Better Mobility.",
    subheading: "Consultant Orthopaedic, Joint Replacement, Sports Injury & Trauma Specialist in JP Nagar and RR Nagar, Bengaluru."
  },

  contact: {
    email: "docck2018@gmail.com",
    phone: "+918431069548",
    phoneDisplay: "+91 84310 69548",
    whatsapp: "918431069548"
  },

  clinics: [
    {
      id: "jp-nagar",
      name: "Viksha Orthopaedic Clinic – JP Nagar",
      area: "JP Nagar",
      address: "95, 15th Main, 17th Cross Rd, 5th Phase, J. P. Nagar, Bengaluru, Karnataka 560078",
      timings: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 2:00 PM",
      areaNote: "Convenient for Banashankari, Jayanagar and Kanakapura Road.",
      phone: "+918431069548",
      phoneDisplay: "+91 84310 69548",
      whatsapp: "918431069548",
      mapUrl: "https://maps.app.goo.gl/b2Ttrd8EPeWkWTKo8",
      mapEmbed: "https://www.google.com/maps?q=95%2C+15th+Main%2C+17th+Cross+Rd%2C+5th+Phase%2C+J.+P.+Nagar%2C+Bengaluru%2C+Karnataka+560078&output=embed"
    },
    {
      id: "rr-nagar",
      name: "Atreum Speciality Hospital – RR Nagar",
      area: "RR Nagar",
      address: "Atreum Speciality Hospital, Ideal Homes Layout, Kenchenhalli, RR Nagar, Bengaluru 560098",
      timings: "Mon–Sat: 10:00 AM – 7:00 PM | Sun: Closed",
      areaNote: "Convenient for Uttarahalli and west of Kanakapura Road.",
      phone: "+919538476804",
      phoneDisplay: "+91 95384 76804",
      whatsapp: "919538476804",
      mapUrl: "https://maps.app.goo.gl/SazAZUPsUyCdkB4c6",
      mapEmbed: "https://www.google.com/maps?q=Atreum+Speciality+Hospital%2C+Ideal+Homes+Layout%2C+Kenchenhalli%2C+RR+Nagar%2C+Bengaluru+560098&output=embed"
    }
  ],

  serviceAreas: [
    "JP Nagar", "RR Nagar", "Banashankari", "Uttarahalli",
    "Kanakapura Road", "Jayanagar", "South Bengaluru"
  ],

  social: {
    facebook: "https://www.facebook.com/share/1Ed8m8Ps2Z/",
    instagram: "https://www.instagram.com/drchethankumarortho?utm_source=qr&stkn=MWFhODU1czh0MzlzZQ==",
    linkedin: "https://www.linkedin.com/in/dr-chethan-kumar-790919258/",
    youtube: ""
  },

  seo: {
    siteUrl: "",
    defaultTitle: "Dr. Chethan Kumar | Orthopaedic Surgeon Bengaluru",
    defaultDescription: "Consultant orthopaedic surgeon in JP Nagar and RR Nagar, Bengaluru. Patient-first, evidence-based care. Knee and hip replacement, sports injury and trauma surgery. Book an appointment."
  }
};
